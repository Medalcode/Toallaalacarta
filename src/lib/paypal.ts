export const PAYPAL_API_URL = import.meta.env.PUBLIC_PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export async function generateAccessToken() {
  const clientId = import.meta.env.PUBLIC_PAYPAL_CLIENT_ID || import.meta.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || import.meta.env.PAYPAL_CLIENT_ID;
  const clientSecret = import.meta.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured in environment variables");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate PayPal access token (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Invalid access token response from PayPal");
  }

  return data.access_token;
}
