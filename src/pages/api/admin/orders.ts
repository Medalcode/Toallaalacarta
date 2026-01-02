import type { APIRoute } from "astro";
import { isAdmin, getAllOrders } from "@/lib/admin-utils";

export const GET: APIRoute = async ({ request, cookies }) => {
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

    // Get query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "all";
    const searchQuery = url.searchParams.get("search") || "";
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    // Get orders
    const result = await getAllOrders({
      token,
      status: status !== "all" ? status : undefined,
      searchQuery: searchQuery || undefined,
      limit,
      offset,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Admin orders API error:", error);
    return new Response(
      JSON.stringify({ message: "Error al obtener pedidos", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
