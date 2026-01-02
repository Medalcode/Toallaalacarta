import type { APIRoute } from "astro";
import { isAdmin, updateOrderStatus, getOrderById } from "@/lib/admin-utils";
import { sendOrderProcessingEmail, sendOrderShippedEmail, sendOrderDeliveredEmail } from "@/lib/email";

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

    // Get current order to check previous status
    const currentOrder = await getOrderById(token, orderId);
    const previousStatus = currentOrder.status;

    // Update order
    const updatedOrder = await updateOrderStatus({
      token,
      orderId,
      status,
      trackingNumber,
    });

    console.log(`✅ Order ${orderId} updated from ${previousStatus} to ${status}`);

    // Send email notification if status changed
    if (previousStatus !== status) {
      try {
        const customerEmail = updatedOrder.customer_email;
        const customerName = updatedOrder.customer_name;
        const orderNumber = updatedOrder.order_number;

        // Send appropriate email based on new status
        switch (status) {
          case 'processing':
            await sendOrderProcessingEmail({
              to: customerEmail,
              orderNumber,
              customerName,
            });
            console.log(`📧 Processing email sent to ${customerEmail}`);
            break;

          case 'shipped':
            await sendOrderShippedEmail({
              to: customerEmail,
              orderNumber,
              customerName,
              trackingNumber: trackingNumber || undefined,
            });
            console.log(`📧 Shipped email sent to ${customerEmail}`);
            break;

          case 'delivered':
            await sendOrderDeliveredEmail({
              to: customerEmail,
              orderNumber,
              customerName,
            });
            console.log(`📧 Delivered email sent to ${customerEmail}`);
            break;

          default:
            // No email for other statuses (pending, cancelled)
            console.log(`ℹ️ No email sent for status: ${status}`);
        }
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Failed to send status update email:', emailError);
        // Continue - order was updated successfully
      }
    }

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
