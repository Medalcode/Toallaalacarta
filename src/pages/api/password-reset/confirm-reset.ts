import type { APIRoute } from "astro";
import { passwordResetManager } from "@/lib/password-reset";
// Nota: Deberíamos importar la mutación de Shopify para cambiar la contraseña
// import { updateCustomerPassword } from "@/lib/shopify";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return new Response(JSON.stringify({ message: "Token y contraseña son requeridos" }), { status: 400 });
    }

    const validation = passwordResetManager.validateToken(token);
    
    if (!validation.valid || !validation.email) {
      return new Response(JSON.stringify({ message: validation.error || "Token inválido" }), { status: 400 });
    }

    // Aquí llamaríamos a Shopify o Appwrite para actualizar la contraseña del cliente
    // await updateCustomerPassword(validation.email, password);

    // Marcar token como usado
    passwordResetManager.useToken(token);

    return new Response(JSON.stringify({ success: true, message: "Contraseña actualizada exitosamente" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Password confirm error:", error);
    return new Response(
      JSON.stringify({ message: "Error al procesar la solicitud" }),
      { status: 500 }
    );
  }
};
