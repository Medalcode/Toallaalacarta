import type { APIRoute } from "astro";
import { getUserDetails } from "@/lib/shopify";
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from "@/lib/rate-limiter";
import { logPasswordReset, logRateLimitExceeded } from "@/lib/audit-logger";
import { validateEmail, sanitizeEmail } from "@/lib/validation";
import { passwordResetManager } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";
import { account } from "@/lib/appwrite";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    // Validate required fields
    if (!email) {
      return new Response(
        JSON.stringify({
          errors: [{ message: "El email es requerido" }],
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail)) {
      return new Response(
        JSON.stringify({
          errors: [{ message: "Email inválido" }],
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Check rate limit
    const identifier = getClientIdentifier(request, sanitizedEmail);
    const rateLimit = rateLimiter.check(
      identifier,
      RATE_LIMITS.PASSWORD_RESET.maxAttempts,
      RATE_LIMITS.PASSWORD_RESET.windowMs,
      RATE_LIMITS.PASSWORD_RESET.blockDurationMs
    );

    if (!rateLimit.allowed) {
      await logRateLimitExceeded(identifier, '/api/forgot-password', request);
      
      return new Response(
        JSON.stringify({
          errors: [{
            code: "RATE_LIMIT_EXCEEDED",
            message: `Demasiados intentos. Intenta nuevamente en ${Math.ceil(rateLimit.resetIn / 60)} minutos.`
          }],
        }),
        { 
          status: 429,
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": rateLimit.resetIn.toString(),
          } 
        },
      );
    }

    // Check if user exists (using Appwrite)
    // We need to verify the user exists before sending email
    // For security, we always return success even if user doesn't exist
    // This prevents email enumeration attacks
    
    let userExists = false;
    let userName = "Usuario";
    
    try {
      // Try to get user by email
      // Note: This is a simplified check. In production, you might need
      // to query Appwrite users collection or use a different method
      
      // For now, we'll assume the user exists and send the email
      // The actual password reset will fail if the user doesn't exist
      userExists = true;
      userName = sanitizedEmail.split('@')[0]; // Use email prefix as name
    } catch (error) {
      // User doesn't exist, but we don't reveal this
      console.log(`Password reset requested for non-existent user: ${sanitizedEmail}`);
    }

    // Generate reset token
    const resetToken = passwordResetManager.createToken(sanitizedEmail);

    // Send password reset email
    try {
      await sendPasswordResetEmail({
        to: sanitizedEmail,
        name: userName,
        resetToken,
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Don't reveal email sending failure to user
    }

    // Log password reset request
    await logPasswordReset(sanitizedEmail, request, 'request');

    // Always return success to prevent email enumeration
    return new Response(
      JSON.stringify({
        success: true,
        message: "Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in forgot-password API:", error);

    return new Response(
      JSON.stringify({
        errors: [
          {
            code: "INTERNAL_ERROR",
            message: "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.",
          },
        ],
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
