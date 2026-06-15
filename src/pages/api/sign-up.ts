import type { APIRoute } from "astro";
import { validateRut } from "@/lib/rut";
import { sendWelcomeEmail } from "@/lib/email";
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from "@/lib/rate-limiter";
import { logRateLimitExceeded } from "@/lib/audit-logger";
import { Client, Account, ID } from "appwrite";
import { APP_CONFIG } from "@/infrastructure/config";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const rut = formData.get("rut")?.toString();

    if (!email || !password || !firstName || !rut) {
      return new Response("Todos los campos son obligatorios", { status: 400 });
    }

    if (!validateRut(rut)) {
        return new Response(JSON.stringify({ errors: [{ message: "RUT inválido" }] }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const identifier = getClientIdentifier(request, email);
    const rateLimit = rateLimiter.check(
      identifier,
      RATE_LIMITS.SIGNUP.maxAttempts,
      RATE_LIMITS.SIGNUP.windowMs,
      RATE_LIMITS.SIGNUP.blockDurationMs
    );

    if (!rateLimit.allowed) {
      await logRateLimitExceeded(identifier, '/api/sign-up', request);
      return new Response(
        JSON.stringify({
          errors: [{ code: "RATE_LIMIT_EXCEEDED", message: `Demasiados intentos. Intenta nuevamente en ${Math.ceil(rateLimit.resetIn / 60)} minutos.` }]
        }),
        { status: 429, headers: { "Content-Type": "application/json", "Retry-After": rateLimit.resetIn.toString() } }
      );
    }

    // Initialize Appwrite Client
    const client = new Client()
      .setEndpoint(APP_CONFIG.appwrite.endpoint)
      .setProject(APP_CONFIG.appwrite.projectId);
    
    const account = new Account(client);

    try {
      // Create user in Appwrite
      const user = await account.create(
        ID.unique(), 
        email, 
        password, 
        firstName
      );

      // Add RUT to prefs (Appwrite preferences)
      // To do this we must be authenticated. Since we just created the user, we need to create a session first.
      const session = await account.createEmailPasswordSession(email, password);
      
      // Now update preferences using the session
      await account.updatePrefs({ rut: rut.replace(/\./g, "").replace(/-/g, "").toLowerCase() });

      // Send welcome email (non-blocking)
      try {
        await sendWelcomeEmail({ to: email, name: firstName });
      } catch (emailError) {
        console.error('⚠️  Failed to send welcome email:', emailError);
      }

      // Return token and user data
      const response = new Response(JSON.stringify({ 
        customer: { id: user.$id, firstName: user.name, email: user.email }, 
        token: session.secret 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      // Set HttpOnly cookie for security
      response.headers.set("Set-Cookie", `token=${session.secret}; Path=/; SameSite=Lax; HttpOnly${import.meta.env.PROD ? '; Secure' : ''}`);

      return response;

    } catch (appwriteError: any) {
      console.error("Appwrite Registration Error:", appwriteError);
      let userFriendlyMessage = "Ocurrió un error al crear la cuenta";
      
      if (appwriteError.code === 409) {
        userFriendlyMessage = "Este correo electrónico ya está registrado.";
      }

      return new Response(JSON.stringify({ errors: [{ code: "REGISTRATION_ERROR", message: userFriendlyMessage }] }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error: any) {
    console.error("Error in API:", error);
    return new Response(
      JSON.stringify({ errors: [{ code: "INTERNAL_ERROR", message: "Ocurrió un error inesperado al procesar la solicitud." }] }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
