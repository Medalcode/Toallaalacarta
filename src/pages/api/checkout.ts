import type { APIRoute } from "astro";
import { getCart } from "@/lib/shopify";
import { Client, Databases, ID, Account } from "appwrite";
import { APPWRITE_CONFIG } from "@/lib/appwrite";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.json();
    const { address, city, cartId } = formData;

    // 1. Require Authentication
    const token = cookies.get("token")?.value;
    
    if (!token) {
        return new Response(JSON.stringify({ message: "Debes iniciar sesión para realizar un pedido" }), {
            status: 401,
        });
    }

    // 2. Setup Appwrite Client with Session
    const client = new Client();
    client
      .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
      .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID)
      .setSession(token);

    const account = new Account(client);
    const databases = new Databases(client);

    // 3. Get Authenticated User Details (source of truth)
    let user;
    try {
        user = await account.get();
    } catch (authError) {
        console.error("Authentication failed in checkout:", authError);
        return new Response(JSON.stringify({ message: "Sesión inválida o expirada" }), {
            status: 401,
        });
    }

    // 4. Validate Shipping Fields (only these come from user input)
    if (!address || !city || !cartId) {
      return new Response(JSON.stringify({ message: "Dirección y ciudad son obligatorias" }), {
        status: 400,
      });
    }

    // 5. Calculate Total Price securely from Cart
    let totalPrice = 0;
    try {
      const cart = await getCart(cartId);
      if (cart) {
        totalPrice = parseFloat(cart.cost.totalAmount.amount);
      }
    } catch (e) {
      console.error("Error fetching cart for checkout:", e);
    }

    // 6. Create Order using AUTHENTICATED user data
    const order = await databases.createDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTION_ORDERS,
      ID.unique(),
      {
        customer_email: user.email, // From authenticated session
        total_price: totalPrice,
        // shipping_address_json: JSON.stringify({ 
        //   name: user.name, 
        //   phone: user.phone, 
        //   address, 
        //   city 
        // }), // TODO: Add to schema when ready
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
        message: "Error procesando el pedido", 
        detail: error.message 
      }),
      { status: 500 }
    );
  }
};
