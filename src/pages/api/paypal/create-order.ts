import type { APIRoute } from "astro";
import { generateAccessToken, PAYPAL_API_URL } from "@/lib/paypal";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { cartId, totalPrice } = await request.json();

    if (!cartId || !totalPrice) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const accessToken = await generateAccessToken();

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
            amount: {
              currency_code: "USD", // TODO: Verify currency logic
              value: totalPrice.toString(),
            },
            custom_id: cartId, // Storing cartId to link later if needed
          },
        ],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status });

  } catch (error: any) {
    console.error("PayPal Create Order Error:", error);
    return new Response(JSON.stringify({ message: "Error creating PayPal order", detail: error.message }), { status: 500 });
  }
};
