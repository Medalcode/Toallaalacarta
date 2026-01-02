import type { APIRoute } from "astro";
import { isAdmin, updateOrderStatus } from "@/lib/admin-utils";

export const POST: APIRoute = async ({ request, cookies }) => {
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

    // Get request data
    const data = await request.json();
    const { orderId, status, trackingNumber } = data;

    if (!orderId || !status) {
      return new Response(JSON.stringify({ message: "Datos incompletos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update order
    const updatedOrder = await updateOrderStatus({
      token,
      orderId,
      status,
      trackingNumber,
    });

    console.log(`✅ Order ${orderId} updated to status: ${status}`);

    return new Response(JSON.stringify({ success: true, order: updatedOrder }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Admin update order API error:", error);
    return new Response(
      JSON.stringify({ message: "Error al actualizar pedido", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
