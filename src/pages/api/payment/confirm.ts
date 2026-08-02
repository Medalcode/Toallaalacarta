import type { APIRoute } from "astro";
import { getWebpayTransaction } from "@/lib/transbank";
import { APP_CONFIG } from "@/infrastructure/config";
import { Client as NodeClient, Databases as NodeDatabases } from "node-appwrite";

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

    // Initialize Admin Client to bypass client permissions
    const apiKey = import.meta.env.APPWRITE_API_KEY;
    if (!apiKey) {
      console.error("❌ APPWRITE_API_KEY is missing in environment variables");
      return redirect(`/checkout/error?reason=server_configuration_error`);
    }

    const client = new NodeClient();
    client
        .setEndpoint(APP_CONFIG.appwrite.endpoint)
        .setProject(APP_CONFIG.appwrite.projectId)
        .setKey(apiKey);

    const databases = new NodeDatabases(client);

    // Find the order by session_id
    const orderId = commitResponse.session_id; 

    // Retrieve order to validate amount and idempotency
    const order = await databases.getDocument(
        APP_CONFIG.appwrite.databaseId,
        APP_CONFIG.appwrite.collections.orders,
        orderId
    );

    if (order.payment_status === 'paid') {
      console.log(`Order ${orderId} already paid`);
      return redirect(`/checkout/success?orderId=${orderId}`);
    }

    // Verify Amount Match! Crucial for integrity
    if (commitResponse.amount !== order.total_price) {
        console.error(`Amount mismatch: TBK ${commitResponse.amount} vs DB ${order.total_price}`);
        await databases.updateDocument(
            APP_CONFIG.appwrite.databaseId,
            APP_CONFIG.appwrite.collections.orders,
            orderId,
            { payment_status: 'failed', notes: 'Amount mismatch detected' }
        );
        return redirect(`/checkout/error?reason=amount_mismatch`);
    }

    if (commitResponse.status === 'AUTHORIZED') {
      // Update order to PAID securely
      await databases.updateDocument(
        APP_CONFIG.appwrite.databaseId,
        APP_CONFIG.appwrite.collections.orders,
        orderId,
        { 
            payment_status: 'paid',
            status: 'processing',
            payment_transaction_id: token_ws
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
