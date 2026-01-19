export const PAYPAL_API_URL = import.meta.env.PUBLIC_PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export async function generateAccessToken() {
  const auth = Buffer.from(
    import.meta.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID + ":" + import.meta.env.PAYPAL_CLIENT_SECRET
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = await response.json();
  return data.access_token;
}
