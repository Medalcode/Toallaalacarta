import type { APIRoute } from "astro";
import { generateAccessToken, PAYPAL_API_URL } from "@/lib/paypal";
import { APP_CONFIG } from "@/infrastructure/config";
import { Client as NodeClient, Databases as NodeDatabases, Query as NodeQuery } from "node-appwrite";

export const GET: APIRoute = async ({ request, url, redirect }) => {
  const token = url.searchParams.get('token'); // PayPal Order ID
  const PayerID = url.searchParams.get('PayerID');

  if (!token) {
    return redirect(`/checkout/error?reason=invalid_token`);
  }

  try {
    // 1. Initialize Appwrite Admin Client
    const client = new NodeClient();
    client
        .setEndpoint(APP_CONFIG.appwrite.endpoint)
        .setProject(APP_CONFIG.appwrite.projectId)
        .setKey(import.meta.env.APPWRITE_API_KEY || '');

    const databases = new NodeDatabases(client);

    // 2. Find order by paypal token
    const ordersResult = await databases.listDocuments(
      APP_CONFIG.appwrite.databaseId,
      APP_CONFIG.appwrite.collections.orders,
      [NodeQuery.equal('payment_transaction_id', token), NodeQuery.limit(1)]
    );

    if (ordersResult.total === 0) {
      console.error("No order found with PayPal token:", token);
      return redirect(`/checkout/error?reason=order_not_found`);
    }

    const order = ordersResult.documents[0];
    const orderId = order.$id;

    if (order.payment_status === 'paid') {
      return redirect(`/checkout/success?orderId=${orderId}`);
    }

    // 3. Capture Payment
    const accessToken = await generateAccessToken();
    const captureResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureResponse.json();

    if (captureData.status === "COMPLETED") {
      // 4. Verify amount matches (cross-validation)
      const capturedAmount = parseFloat(captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '0');
      
      if (capturedAmount !== order.total_price) {
        console.error(`Amount mismatch: PayPal ${capturedAmount} vs DB ${order.total_price}`);
        await databases.updateDocument(
            APP_CONFIG.appwrite.databaseId,
            APP_CONFIG.appwrite.collections.orders,
            orderId,
            { payment_status: 'failed', notes: 'Amount mismatch detected via PayPal' }
        );
        return redirect(`/checkout/error?reason=amount_mismatch`);
      }

      // 5. Update order to paid
      await databases.updateDocument(
        APP_CONFIG.appwrite.databaseId,
        APP_CONFIG.appwrite.collections.orders,
        orderId,
        { 
            payment_status: 'paid',
            payment_method: 'paypal',
            status: 'processing'
        }
      );
      return redirect(`/checkout/success?orderId=${orderId}`);
    } else {
      await databases.updateDocument(
        APP_CONFIG.appwrite.databaseId,
        APP_CONFIG.appwrite.collections.orders,
        orderId,
        { payment_status: 'failed' }
      );
      return redirect(`/checkout/error?reason=failed`);
    }

  } catch (error: any) {
    console.error("PayPal Confirm Error:", error);
    return redirect(`/checkout/error?reason=system_error`);
  }
};
