import type { APIRoute } from "astro";
import { generateAccessToken, PAYPAL_API_URL } from "@/lib/paypal";
import { APP_CONFIG } from "@/infrastructure/config";
import { Client as NodeClient, Databases as NodeDatabases } from "node-appwrite";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { cartId, totalPrice, internalOrderId } = await request.json();

    if (!cartId || !totalPrice || !internalOrderId) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const accessToken = await generateAccessToken();
    const origin = new URL(request.url).origin;

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: internalOrderId,
            amount: {
              currency_code: "USD", // TODO: Verify currency logic
              value: totalPrice.toString(),
            },
            custom_id: internalOrderId, 
          },
        ],
        application_context: {
          return_url: `${origin}/api/paypal/confirm`,
          cancel_url: `${origin}/checkout/error?reason=aborted`,
        }
      }),
    });

    const data = await response.json();

    if (data.id) {
      // Save paypal token/id to our DB order
      const client = new NodeClient();
      client
          .setEndpoint(APP_CONFIG.appwrite.endpoint)
          .setProject(APP_CONFIG.appwrite.projectId)
          .setKey(import.meta.env.APPWRITE_API_KEY || '');
      
      const databases = new NodeDatabases(client);
      await databases.updateDocument(
          APP_CONFIG.appwrite.databaseId,
          APP_CONFIG.appwrite.collections.orders,
          internalOrderId,
          { payment_transaction_id: data.id }
      );
    }

    return new Response(JSON.stringify(data), { status: response.status });

  } catch (error: any) {
    console.error("PayPal Create Order Error:", error);
    return new Response(JSON.stringify({ message: "Error creating PayPal order", detail: error.message }), { status: 500 });
  }
};
