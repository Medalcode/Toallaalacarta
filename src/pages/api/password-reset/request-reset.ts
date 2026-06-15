import type { APIRoute } from "astro";
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from "@/lib/rate-limiter";
import { logRateLimitExceeded } from "@/lib/audit-logger";
import { Client, Account } from "appwrite";
import { APP_CONFIG } from "@/infrastructure/config";

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ message: "Email es requerido" }), { status: 400 });
    }

    const identifier = getClientIdentifier(request, email);
    const rateLimit = rateLimiter.check(
      identifier,
      RATE_LIMITS.PASSWORD_RESET.maxAttempts,
      RATE_LIMITS.PASSWORD_RESET.windowMs,
      RATE_LIMITS.PASSWORD_RESET.blockDurationMs
    );

    if (!rateLimit.allowed) {
      await logRateLimitExceeded(identifier, '/api/password-reset/request', request);
      return new Response(
        JSON.stringify({
            message: `Demasiados intentos. Intenta nuevamente en ${Math.ceil(rateLimit.resetIn / 60)} minutos.`
        }),
        { status: 429 }
      );
    }

    const client = new Client()
      .setEndpoint(APP_CONFIG.appwrite.endpoint)
      .setProject(APP_CONFIG.appwrite.projectId);
    
    const account = new Account(client);

    const resetUrl = new URL('/reset-password', url.origin).toString();

    try {
      // Appwrite natively sends the recovery email containing userId and secret query parameters
      await account.createRecovery(email, resetUrl);
    } catch (e: any) {
      console.error("Appwrite createRecovery error:", e);
      // We don't return an error here to prevent email enumeration attacks
    }

    return new Response(JSON.stringify({ success: true, message: "Si el correo está registrado, recibirás un enlace de recuperación." }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Password reset error:", error);
    return new Response(
      JSON.stringify({ message: "Error al procesar la solicitud" }),
      { status: 500 }
    );
  }
};
