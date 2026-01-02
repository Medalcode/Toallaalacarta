import type { APIRoute } from "astro";
import { isAdmin, getOrderStats } from "@/lib/admin-utils";

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Check authentication
    const token = cookies.get("token")?.value;
    
    if (!token) {
      return new Response(JSON.stringify({ message: "No autenticado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(token);
    
    if (!userIsAdmin) {
      return new Response(JSON.stringify({ message: "No autorizado" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get statistics
    const stats = await getOrderStats(token);

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Admin stats API error:", error);
    return new Response(
      JSON.stringify({ message: "Error al obtener estadísticas", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
