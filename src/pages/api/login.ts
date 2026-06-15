import { rateLimiter, RATE_LIMITS, getClientIdentifier } from "@/lib/rate-limiter";
import { logUserLogin, logRateLimitExceeded } from "@/lib/audit-logger";
import { validateEmail, sanitizeEmail } from "@/lib/validation";
import type { APIRoute } from "astro";
import { Client, Account } from "appwrite";
import { APP_CONFIG } from "@/infrastructure/config";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ errors: [{ message: "Email y contraseña son requeridos" }] }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ errors: [{ message: "Email inválido" }] }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const identifier = getClientIdentifier(request, sanitizedEmail);
    const rateLimit = rateLimiter.check(
      identifier,
      RATE_LIMITS.LOGIN.maxAttempts,
      RATE_LIMITS.LOGIN.windowMs,
      RATE_LIMITS.LOGIN.blockDurationMs
    );

    if (!rateLimit.allowed) {
      await logRateLimitExceeded(identifier, '/api/login', request);
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
      // Create session with Appwrite
      const session = await account.createEmailPasswordSession(sanitizedEmail, password);
      
      // Fetch user details to return to frontend
      const user = await account.get();

      rateLimiter.reset(identifier);
      await logUserLogin(user.$id, sanitizedEmail, request, true);

      // Return the token (secret) and user info
      const response = new Response(JSON.stringify({
        id: user.$id,
        firstName: user.name,
        email: user.email,
        token: session.secret
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      // Secure HTTPOnly cookie
      response.headers.set("Set-Cookie", `token=${session.secret}; Path=/; SameSite=Lax; HttpOnly${import.meta.env.PROD ? '; Secure' : ''}`);

      return response;

    } catch (appwriteError: any) {
      await logUserLogin('', sanitizedEmail, request, false);
      return new Response(JSON.stringify({ errors: [{ message: appwriteError.message || "Credenciales inválidas" }] }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error: any) {
    console.error("Error during login:", error);
    return new Response(
      JSON.stringify({ errors: [{ code: "INTERNAL_ERROR", message: "Error interno al iniciar sesión." }] }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
