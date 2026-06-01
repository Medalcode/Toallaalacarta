import type { APIRoute } from "astro";
import { getWebpayTransaction, generateBuyOrder } from "@/lib/transbank";
import { appwriteService } from "@/infrastructure/database/appwrite.client";
import { orderService } from "@/modules/orders/orders.service";
import { APP_CONFIG } from "@/infrastructure/config";

export const POST: APIRoute = async ({ request, cookies, url }) => {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return new Response(JSON.stringify({ message: "orderId es requerido" }), { status: 400 });
    }

    const token = cookies.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ message: "No autorizado" }), { status: 401 });
    }

    const { account, databases } = appwriteService.createSessionClient(token);
    
    // Validate order belongs to user and is pending
    const order = await orderService.getOrder(orderId, databases);
    if (!order) {
      return new Response(JSON.stringify({ message: "Orden no encontrada" }), { status: 404 });
    }

    if (order.payment_status !== 'pending') {
      return new Response(JSON.stringify({ message: "La orden ya ha sido pagada o está en otro estado" }), { status: 400 });
    }

    const buyOrder = order.order_number || generateBuyOrder();
    const sessionId = orderId; 
    const amount = order.total_price;
    const returnUrl = new URL('/api/payment/confirm', url.origin).toString();

    const tx = getWebpayTransaction();
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

    // Save token to order in appwrite (optional but good for tracking)
    await databases.updateDocument(
        APP_CONFIG.appwrite.databaseId,
        APP_CONFIG.appwrite.collections.orders,
        orderId,
        { payment_transaction_id: response.token }
    );

    return new Response(JSON.stringify({
      token: response.token,
      url: response.url
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("Payment Create Error:", error);
    return new Response(
      JSON.stringify({ message: "Error al iniciar el pago", detail: error.message }),
      { status: 500 }
    );
  }
};
