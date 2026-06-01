import type { APIRoute } from "astro";
import { isAdmin } from "@/lib/admin-utils";
import { getProducts } from "@/lib/shopify";

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    // Check authentication
    const token = cookies.get("token")?.value;
    
    if (!token) {
      return new Response(JSON.stringify({ message: "No autenticado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(token);
    
    if (!userIsAdmin) {
      return new Response(JSON.stringify({ message: "No autorizado" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all products from Shopify
    // In a real large store, this would need pagination using cursors.
    // We fetch a batch (e.g. 100) for the dashboard.
    const { products } = await getProducts({});

    // Format for inventory panel
    const inventory = products.map((product: any) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      vendor: product.vendor,
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.availableForSale,
        price: variant.price
      }))
    }));

    return new Response(JSON.stringify(inventory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Admin inventory API error:", error);
    return new Response(
      JSON.stringify({ message: "Error al obtener inventario", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
