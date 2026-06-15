import type { APIRoute } from "astro";
import { appwriteService } from "@/infrastructure/database/appwrite.client";

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ message: "No autorizado" }), { status: 401 });
    }

    const { account } = appwriteService.createSessionClient(token);
    
    let prefs;
    try {
      prefs = await account.getPrefs();
    } catch (error) {
      return new Response(JSON.stringify({ message: "Sesión inválida o error al obtener preferencias" }), { status: 401 });
    }
    
    // Si no existen las preferencias, establecemos valores por defecto para la UI
    const defaultPrefs = {
      email_orders: prefs.email_orders !== undefined ? prefs.email_orders : true,
      email_promotions: prefs.email_promotions !== undefined ? prefs.email_promotions : false,
      rut: prefs.rut || ''
    };

    return new Response(JSON.stringify(defaultPrefs), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

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

    const { account } = appwriteService.createSessionClient(token);
    
    let existingPrefs;
    try {
      existingPrefs = await account.getPrefs();
    } catch (error) {
      return new Response(JSON.stringify({ message: "Sesión inválida o error al verificar usuario" }), { status: 401 });
    }

    const data = await request.json();

    const newPrefs = {
      ...existingPrefs,
      email_orders: data.email_orders !== undefined ? data.email_orders : true,
      email_promotions: data.email_promotions !== undefined ? data.email_promotions : false,
    };

    const updated = await account.updatePrefs(newPrefs);
    
    return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("Preferences POST Error:", error);
    return new Response(
      JSON.stringify({ message: "Error al guardar preferencias" }),
      { status: 500 }
    );
  }
};
