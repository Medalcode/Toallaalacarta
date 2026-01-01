import type { APIRoute } from "astro";
import { Client, Account, Databases, Query } from "appwrite";
import { APPWRITE_CONFIG } from "@/lib/appwrite";

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    const client = new Client();
    client
      .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
      .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID);
    
    // Set the session context for this client using the token passed in cookies
    client.setSession(token);

    const account = new Account(client);
    const databases = new Databases(client);

    // 1. Get User Details
    const user = await account.get();

    // 2. Get User Orders
    // We filter by email because that's how we linked them in checkout.ts
    // Ideally we filter by owner (user.$id) but our schema uses customer_email.
    // If we used permissions correctly, listDocuments might implicitly only return owned docs, 
    // but the query makes it explicit.
    const ordersResponse = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_ORDERS,
        [
            Query.equal('customer_email', user.email),
            Query.orderDesc('$createdAt')
        ]
    );

    return new Response(JSON.stringify({
        user: {
            id: user.$id,
            firstName: user.name,
            email: user.email,
            phone: user.phone
        },
        orders: ordersResponse.documents
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("Profile API Error:", error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
};
