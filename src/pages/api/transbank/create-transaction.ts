import type { APIRoute } from 'astro';
import { getWebpayPlus, generateBuyOrder } from '@/lib/transbank';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { amount, sessionId, returnUrl } = body;

    // Validate inputs
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Session ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate unique buy order
    const buyOrder = generateBuyOrder();

    // Get Webpay Plus instance
    const webpay = getWebpayPlus();

    // Create transaction
    const response = await webpay.create(
      buyOrder,
      sessionId,
      Math.round(amount), // Amount in CLP (integer)
      returnUrl || `${new URL(request.url).origin}/payment/transbank-return`
    );

    console.log('✅ Transbank transaction created:', {
      buyOrder,
      token: response.token,
      url: response.url,
    });

    return new Response(
      JSON.stringify({
        success: true,
        token: response.token,
        url: response.url,
        buyOrder,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error creating Transbank transaction:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
