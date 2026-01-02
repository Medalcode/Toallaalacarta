import { getCustomerAccessToken, getUserDetails } from "@/lib/shopify";
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from "@/lib/rate-limiter";
import { logUserLogin, logRateLimitExceeded } from "@/lib/audit-logger";
import { validateEmail, sanitizeEmail } from "@/lib/validation";
import type { APIRoute } from "astro";

// Exporting the handler function for the API route
export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          errors: [{ message: "Email y contraseña son requeridos" }],
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
      RATE_LIMITS.LOGIN.maxAttempts,
      RATE_LIMITS.LOGIN.windowMs,
      RATE_LIMITS.LOGIN.blockDurationMs
    );

    if (!rateLimit.allowed) {
      // Log rate limit exceeded
      await logRateLimitExceeded(identifier, '/api/login', request);
      
      return new Response(
        JSON.stringify({
          errors: [{
            code: "RATE_LIMIT_EXCEEDED",
            message: `Demasiados intentos de inicio de sesión. Intenta nuevamente en ${Math.ceil(rateLimit.resetIn / 60)} minutos.`
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

    // Get the customer token via Shopify API
    const { token, customerLoginErrors } = await getCustomerAccessToken({
      email: sanitizedEmail,
      password,
    });

    if (customerLoginErrors?.length > 0) {
      // Log failed login attempt
      await logUserLogin('', sanitizedEmail, request, false);
      
      return new Response(JSON.stringify({ errors: customerLoginErrors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch customer details using the token
    const { customer } = await getUserDetails(token);

    // Reset rate limit on successful login
    rateLimiter.reset(identifier);

    // Log successful login
    await logUserLogin(customer.id || '', sanitizedEmail, request, true);

    const response = new Response(JSON.stringify({ ...customer, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    // Set token in cookie with HttpOnly flag
    response.headers.set("Set-Cookie", `token=${token}; Path=/; SameSite=Lax; HttpOnly`);

    return response;
  } catch (error: any) {
    console.error("Error during login:", error);

    return new Response(
      JSON.stringify({
        errors: [
          {
            code: "INTERNAL_ERROR",
            message: "Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.",
          },
        ],
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
