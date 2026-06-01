import type { APIRoute } from "astro";
import { passwordResetManager } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from "@/lib/rate-limiter";
import { logRateLimitExceeded } from "@/lib/audit-logger";

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

    // Always generate a token, but in real life we should verify if the user exists in Shopify or Appwrite.
    // For privacy reasons, we return a success response even if the email doesn't exist.
    const token = passwordResetManager.createToken(email);
    const resetUrl = new URL(`/reset-password?token=${token}`, url.origin).toString();

    // Enviar email
    await sendPasswordResetEmail({
      to: email,
      name: "Usuario",
      resetToken: resetUrl,
    }).catch((e: any) => console.error("Error al enviar email de recuperación:", e));

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
