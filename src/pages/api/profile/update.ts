import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    const { name, phone, password } = await request.json();
    const headers = {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': import.meta.env.PUBLIC_APPWRITE_PROJECT_ID,
        'X-Appwrite-Session': token
    };

    const endpoint = import.meta.env.PUBLIC_APPWRITE_ENDPOINT;

    // 1. Update Name
    if (name) {
        const nameRes = await fetch(`${endpoint}/account/name`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ name })
        });
        
        if (!nameRes.ok) {
             const err = await nameRes.json();
             throw new Error(err.message || "Failed to update name");
        }
    }

    // 2. Update Phone
    if (phone) {
        if (!password) {
             return new Response(JSON.stringify({ message: "Password required for phone update" }), { status: 400 });
        }
        
        const phoneRes = await fetch(`${endpoint}/account/phone`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ phone, password })
        });

        if (!phoneRes.ok) {
             const err = await phoneRes.json();
             throw new Error(err.message || "Failed to update phone");
        }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Profile Update API Error:", error);
    return new Response(JSON.stringify({ message: error.message || "Error updating profile" }), { status: 500 });
  }
};
