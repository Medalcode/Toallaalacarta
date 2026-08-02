import type { APIRoute } from "astro";
import { Client, Account } from "appwrite";
import { APP_CONFIG } from "@/infrastructure/config";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Appwrite requires userId and secret, which come from the recovery URL
    const { userId, secret, password, passwordConfirm } = await request.json();

    if (!userId || !secret || !password || !passwordConfirm) {
      return new Response(JSON.stringify({ message: "Faltan datos requeridos para el reseteo" }), { status: 400 });
    }

    if (password !== passwordConfirm) {
      return new Response(JSON.stringify({ message: "Las contraseñas no coinciden" }), { status: 400 });
    }

    const client = new Client()
      .setEndpoint(APP_CONFIG.appwrite.endpoint)
      .setProject(APP_CONFIG.appwrite.projectId);
    
    const account = new Account(client);

    // Call Appwrite to update password securely
    await account.updateRecovery(userId, secret, password);

    return new Response(JSON.stringify({ success: true, message: "Contraseña actualizada exitosamente" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Password confirm error:", error);
    return new Response(
      JSON.stringify({ message: error.message || "Error al procesar la solicitud" }),
      { status: 400 }
    );
  }
};
