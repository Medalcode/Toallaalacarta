import type { APIRoute } from "astro";
import { getUserDetails } from "@/lib/shopify";
import { appwriteService } from "@/infrastructure/database/appwrite.client";
import { APP_CONFIG } from "@/infrastructure/config";
import { ID } from "appwrite";

// ID de la colección para preferencias (deberá crearse en Appwrite)
const PREFERENCES_COLLECTION = 'user_preferences';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ message: "No autorizado" }), { status: 401 });
    }

    // Verificar identidad con Shopify
    const { customer } = await getUserDetails(token);
    if (!customer?.email) {
      return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 });
    }

    // Usar cliente público para leer/escribir ya que dependemos de Shopify para la Auth
    const client = appwriteService.getPublicClient();
    const databases = appwriteService.databases;
    
    // Convertir email a un ID válido de Appwrite (solo alfanumérico y guiones)
    const documentId = customer.email.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase().substring(0, 36);

    try {
      const preferences = await databases.getDocument(
        APP_CONFIG.appwrite.databaseId,
        PREFERENCES_COLLECTION,
        documentId
      );
      
      return new Response(JSON.stringify(preferences), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (e: any) {
      // Si el documento no existe, retornamos valores por defecto
      if (e.code === 404) {
        return new Response(JSON.stringify({ email_orders: true, email_promotions: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      throw e;
    }

  } catch (error: any) {
    console.error("Preferences GET Error:", error);
    return new Response(
      JSON.stringify({ message: "Error al obtener preferencias" }),
      { status: 500 }
    );
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ message: "No autorizado" }), { status: 401 });
    }

    const { customer } = await getUserDetails(token);
    if (!customer?.email) {
      return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 });
    }

    const data = await request.json();
    const databases = appwriteService.databases;
    
    const documentId = customer.email.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase().substring(0, 36);

    const preferencesData = {
      email_orders: data.email_orders !== undefined ? data.email_orders : true,
      email_promotions: data.email_promotions !== undefined ? data.email_promotions : false,
    };

    try {
      // Intentar actualizar
      const updated = await databases.updateDocument(
        APP_CONFIG.appwrite.databaseId,
        PREFERENCES_COLLECTION,
        documentId,
        preferencesData
      );
      return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (e: any) {
      // Si no existe, crear
      if (e.code === 404) {
        const created = await databases.createDocument(
          APP_CONFIG.appwrite.databaseId,
          PREFERENCES_COLLECTION,
          documentId,
          {
            email: customer.email,
            ...preferencesData
          }
        );
        return new Response(JSON.stringify(created), { status: 201, headers: { "Content-Type": "application/json" } });
      }
      throw e;
    }
  } catch (error: any) {
    console.error("Preferences POST Error:", error);
    return new Response(
      JSON.stringify({ message: "Error al guardar preferencias" }),
      { status: 500 }
    );
  }
};
