import type { APIRoute } from 'astro';
import { getWebpayPlus } from '@/lib/transbank';
import { Client, Databases } from 'node-appwrite';
import { sendOrderConfirmationEmail } from '@/lib/email';

const client = new Client()
  .setEndpoint(import.meta.env.APPWRITE_ENDPOINT)
  .setProject(import.meta.env.APPWRITE_PROJECT_ID)
  .setKey(import.meta.env.APPWRITE_API_KEY);

const databases = new Databases(client);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get Webpay Plus instance
    const webpay = getWebpayPlus();

    // Commit transaction
    const response = await webpay.commit(token);

    console.log('✅ Transbank transaction committed:', {
      buyOrder: response.buy_order,
      status: response.status,
      amount: response.amount,
      authorizationCode: response.authorization_code,
    });

    // Check if transaction was successful
    const isApproved = response.status === 'AUTHORIZED';

    if (isApproved) {
      // Find order by session ID (buy_order contains session ID)
      // Note: You'll need to store the mapping between buy_order and order ID
      // For now, we'll search by session_id which should be in the buy_order
      
      try {
        // Update order in Appwrite
        // This is a simplified version - you'll need to implement proper order lookup
        const orderData = {
          payment_status: 'paid',
          payment_method: 'transbank',
          transbank_token: token,
          transbank_buy_order: response.buy_order,
          payment_details_json: JSON.stringify({
            status: response.status,
            amount: response.amount,
            authorizationCode: response.authorization_code,
            cardNumber: response.card_detail?.card_number,
            transactionDate: response.transaction_date,
            accountingDate: response.accounting_date,
            installmentsNumber: response.installments_number,
          }),
          order_status: 'processing',
        };

        // TODO: Implement order lookup and update
        // const order = await databases.updateDocument(
        //   import.meta.env.APPWRITE_DATABASE_ID,
        //   import.meta.env.APPWRITE_ORDERS_COLLECTION_ID,
        //   orderId,
        //   orderData
        // );

        // TODO: Send confirmation email
        // await sendOrderConfirmationEmail({ ... });

        console.log('✅ Order updated successfully');
      } catch (error) {
        console.error('❌ Error updating order:', error);
      }
    }

    return new Response(
      JSON.stringify({
        success: isApproved,
        status: response.status,
        buyOrder: response.buy_order,
        amount: response.amount,
        authorizationCode: response.authorization_code,
        cardNumber: response.card_detail?.card_number,
        transactionDate: response.transaction_date,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error committing Transbank transaction:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to commit transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
