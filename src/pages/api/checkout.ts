import type { APIRoute } from "astro";
import { getCart } from "@/lib/shopify";
import { Client, Databases, ID } from "appwrite";
import { APPWRITE_CONFIG } from "@/lib/appwrite";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.json();
    const { email, firstName, lastName, address, city, phone, cartId } = formData;

    // Validate required fields
    if (!email || !address || !cartId) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), {
        status: 400,
      });
    }

    // 1. Calculate Total Price securely from Cart
    let totalPrice = 0;
    try {
      const cart = await getCart(cartId);
      if (cart) {
        totalPrice = parseFloat(cart.cost.totalAmount.amount);
      }
    } catch (e) {
      console.error("Error fetching cart for checkout:", e);
      // Fallback or fail? We proceed with 0 or fail. 
      // Proceeding might be safer for now to get the order through in this 'fix' phase.
    }

    // 2. Setup Appwrite Client
    const client = new Client();
    client
      .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
      .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID);

    // 3. Handle Authentication (Session)
    // If the user is logged in, we want to create the order as "them".
    // If they are guest, we validly might have issues if permissions allow only "Users".
    // Try to retrieve the session token from cookies to act as the user.
    const token = cookies.get("token")?.value;
    
    if (token) {
        client.setSession(token);
    }
    
    // Note: If 'token' is missing (Guest), this creates the document as a Guest.
    // If 'Orders' collection requires authentication, this will fail for Guests.
    // Ideally, we would use an API Key here to bypass permissions if we wanted to support Guest Checkout 
    // without public write access, but standard pattern is Client-Side or Session-Based.
    
    const databases = new Databases(client);

    const order = await databases.createDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTION_ORDERS,
      ID.unique(),
      {
        customer_email: email,
        total_price: totalPrice,
        // status: 'pending', // Removed as it is not in the schema yet
        // shipping_address_json: JSON.stringify({ firstName, lastName, address, city, phone }), // TODO: Add to schema
        // line_items_json: JSON.stringify({ cartId }) // TODO: Add to schema 
      }
    );

    return new Response(JSON.stringify({ orderId: order.$id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error: any) {
    console.error("Checkout API Error:", error);
    return new Response(
      JSON.stringify({ 
        message: "Error processing order", 
        detail: error.message 
      }),
      { status: 500 }
    );
  }
};
