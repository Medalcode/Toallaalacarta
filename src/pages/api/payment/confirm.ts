import type { APIRoute } from "astro";
import { getWebpayTransaction } from "@/lib/transbank";
import { appwriteService } from "@/infrastructure/database/appwrite.client";
import { APP_CONFIG } from "@/infrastructure/config";
import { Query } from "appwrite";

export const GET: APIRoute = async ({ request, url, redirect }) => {
  const token_ws = url.searchParams.get('token_ws');
  const TBK_TOKEN = url.searchParams.get('TBK_TOKEN');
  const TBK_ORDEN_COMPRA = url.searchParams.get('TBK_ORDEN_COMPRA');
  const TBK_ID_SESION = url.searchParams.get('TBK_ID_SESION');

  // Handle User Abort (Webpay Plus returns TBK_TOKEN when user aborts)
  if (TBK_TOKEN && !token_ws) {
    console.log("Pago anulado por el usuario");
    return redirect(`/checkout/error?reason=aborted`);
  }

  if (!token_ws) {
    return redirect(`/checkout/error?reason=invalid_token`);
  }

  try {
    const tx = getWebpayTransaction();
    const commitResponse = await tx.commit(token_ws);

    // Admin client to update order status bypassing user permissions if needed, 
    // but typically webhooks need admin client
    const databases = appwriteService.databases;

    // Find the order by session_id or token
    const orderId = commitResponse.session_id; 

    if (commitResponse.status === 'AUTHORIZED') {
      // Update order to PAID
      await databases.updateDocument(
        APP_CONFIG.appwrite.databaseId,
        APP_CONFIG.appwrite.collections.orders,
        orderId,
        { 
            payment_status: 'paid',
            status: 'processing'
        }
      );
      return redirect(`/checkout/success?orderId=${orderId}`);
    } else {
      // Update order to FAILED
      await databases.updateDocument(
        APP_CONFIG.appwrite.databaseId,
        APP_CONFIG.appwrite.collections.orders,
        orderId,
        { payment_status: 'failed' }
      );
      return redirect(`/checkout/error?reason=failed`);
    }

  } catch (error: any) {
    console.error("Transbank Commit Error:", error);
    return redirect(`/checkout/error?reason=system_error`);
  }
};
