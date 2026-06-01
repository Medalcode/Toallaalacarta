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
    const { orderIds, status } = data;

    if (!orderIds || !Array.isArray(orderIds) || !status) {
      return new Response(JSON.stringify({ message: "Datos incompletos o formato inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = [];
    const errors = [];

    // Update each order
    // In production with many orders, this should be chunked or use Appwrite Functions/Bulk updates if available
    for (const orderId of orderIds) {
      try {
        // Use the existing utility (which doesn't send bulk emails right now to avoid spam, 
        // wait, updateOrderStatus doesn't send emails, the update-order.ts endpoint does it. 
        // So bulk updating will not send emails unless we add the email logic here too).
        // Since it's a bulk update, skipping emails or sending them is a product decision.
        // We will just update the status silently for now to avoid bulk spam, or we could call the same email logic.
        // For Phase 7, we'll just update the status.
        const updatedOrder = await updateOrderStatus({
          token,
          orderId,
          status,
        });
        results.push(updatedOrder.$id);
      } catch (e: any) {
        console.error(`Failed to bulk update order ${orderId}:`, e);
        errors.push({ orderId, error: e.message });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      updatedCount: results.length,
      failedCount: errors.length,
      errors 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Admin bulk update API error:", error);
    return new Response(
      JSON.stringify({ message: "Error al actualizar pedidos masivamente", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
