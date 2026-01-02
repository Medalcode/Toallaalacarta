import { createCustomer, getCustomerAccessToken } from "@/lib/shopify";
import type { APIRoute } from "astro";
import { validateRut } from "@/lib/rut";
import { sendWelcomeEmail } from "@/lib/email";

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

    // Sanitize RUT to use as User ID (remove dots and dash)
    // Example: 12.345.678-9 -> 123456789
    const sanitizedRut = rut.replace(/\./g, "").replace(/-/g, "").toLowerCase();

    // Create customer via Shopify API (or Appwrite adapter)
    const { customer, customerCreateErrors } = await createCustomer({
      email,
      password,
      firstName,
      id: sanitizedRut // Pass RUT as the ID
    });

    if (customerCreateErrors && customerCreateErrors.length > 0) {
      // Check for duplicate user errors and provide user-friendly messages
      const errorMessage = customerCreateErrors[0]?.message || "";
      let userFriendlyMessage = errorMessage;
      
      if (errorMessage.includes("same id") || errorMessage.includes("already exists")) {
        userFriendlyMessage = "Este RUT ya está registrado. Si ya tienes una cuenta, inicia sesión.";
      } else if (errorMessage.includes("email")) {
        userFriendlyMessage = "Este correo electrónico ya está registrado.";
      }
      
      return new Response(JSON.stringify({ 
        errors: [{ 
          code: "REGISTRATION_ERROR",
          message: userFriendlyMessage 
        }] 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate token
    const { token } = await getCustomerAccessToken({ email, password });

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail({
        to: email,
        name: firstName,
      });
    } catch (emailError) {
      // Log error but don't fail the registration
      console.error('⚠️  Failed to send welcome email:', emailError);
    }

    const response = new Response(JSON.stringify({ customer, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    // Set the authentication token in a cookie without HttpOnly
    response.headers.set("Set-Cookie", `token=${token}; Path=/; SameSite=Lax`);

    return response;
  } catch (error: any) {
    console.error("Error in API:", error);
    
    // Check for duplicate user error (RUT already exists)
    const errorMessage = error.message || "";
    let userFriendlyMessage = "Ocurrió un error al crear la cuenta";
    
    if (errorMessage.includes("same id") || errorMessage.includes("already exists")) {
      userFriendlyMessage = "Este RUT ya está registrado. Si ya tienes una cuenta, inicia sesión.";
    } else if (errorMessage.includes("email")) {
      userFriendlyMessage = "Este correo electrónico ya está registrado.";
    }
    
    return new Response(
      JSON.stringify({
        errors: [
          {
            code: "REGISTRATION_ERROR",
            message: userFriendlyMessage,
          },
        ],
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
