import type { APIRoute } from "astro";
import { Query } from "appwrite";
import { APP_CONFIG } from "@/infrastructure/config";
import { appwriteService } from "@/infrastructure/database/appwrite.client";

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    const { account, databases } = appwriteService.createSessionClient(token);

    // 1. Get User Details
    const user = await account.get();

    // 2. Get User Orders
    const ordersResponse = await databases.listDocuments(
        APP_CONFIG.appwrite.databaseId,
        APP_CONFIG.appwrite.collections.orders,
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
