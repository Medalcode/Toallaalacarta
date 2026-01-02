import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: import.meta.env.EMAIL_FROM || 'Toalla a la Carta <onboarding@resend.dev>',
  replyTo: import.meta.env.EMAIL_REPLY_TO || 'contacto@toallaalacarta.cl',
  companyName: 'Toalla a la Carta',
  companyUrl: import.meta.env.PUBLIC_SITE_URL || 'https://toallaalacarta.cl',
};

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  customerName,
  totalPrice,
  items,
  shippingAddress,
}: {
  to: string;
  orderNumber: string;
  customerName: string;
  totalPrice: number;
  items: any[];
  shippingAddress: any;
}) {
  try {
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          ${item.title}${item.variantTitle ? ` - ${item.variantTitle}` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          $${item.price.toLocaleString('es-CL')}
        </td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Pedido - ${orderNumber}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                        ${EMAIL_CONFIG.companyName}
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Success Icon -->
                  <tr>
                    <td style="padding: 40px 30px 20px; text-align: center;">
                      <div style="width: 80px; height: 80px; background-color: #10b981; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13l4 4L19 7" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 0 30px 30px;">
                      <h2 style="color: #111827; margin: 0 0 10px; font-size: 24px; text-align: center;">
                        ¡Gracias por tu compra, ${customerName}!
                      </h2>
                      <p style="color: #6b7280; margin: 0 0 30px; text-align: center; font-size: 16px;">
                        Tu pedido ha sido recibido y está siendo procesado.
                      </p>
                      
                      <!-- Order Number -->
                      <div style="background-color: #f9fafb; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                        <p style="color: #6b7280; margin: 0 0 5px; font-size: 14px; font-weight: 500;">
                          Número de Orden
                        </p>
                        <p style="color: #667eea; margin: 0; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace;">
                          ${orderNumber}
                        </p>
                      </div>
                      
                      <!-- Order Items -->
                      <h3 style="color: #111827; margin: 0 0 15px; font-size: 18px;">
                        Resumen del Pedido
                      </h3>
                      <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                        <thead>
                          <tr style="background-color: #f9fafb;">
                            <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
                              Producto
                            </th>
                            <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
                              Cantidad
                            </th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
                              Precio
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsHtml}
                          <tr style="background-color: #f9fafb;">
                            <td colspan="2" style="padding: 12px; font-weight: 600; color: #111827;">
                              Total
                            </td>
                            <td style="padding: 12px; text-align: right; font-weight: 700; color: #667eea; font-size: 18px;">
                              $${totalPrice.toLocaleString('es-CL')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <!-- Shipping Address -->
                      <h3 style="color: #111827; margin: 0 0 15px; font-size: 18px;">
                        Dirección de Envío
                      </h3>
                      <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
                        <p style="margin: 0; color: #374151; line-height: 1.8;">
                          <strong>${shippingAddress.name}</strong><br>
                          ${shippingAddress.address}<br>
                          ${shippingAddress.city}${shippingAddress.region ? `, ${shippingAddress.region}` : ''}<br>
                          ${shippingAddress.phone}
                        </p>
                      </div>
                      
                      <!-- Next Steps -->
                      <h3 style="color: #111827; margin: 0 0 15px; font-size: 18px;">
                        ¿Qué sigue?
                      </h3>
                      <ol style="color: #6b7280; margin: 0 0 30px; padding-left: 20px; line-height: 1.8;">
                        <li>Prepararemos tu pedido con el bordado personalizado que solicitaste.</li>
                        <li>Te notificaremos cuando tu pedido sea enviado con el número de seguimiento.</li>
                        <li>Los bordados personalizados pueden tomar entre 3-5 días hábiles.</li>
                      </ol>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${EMAIL_CONFIG.companyUrl}/account" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          Ver Mi Pedido
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; margin: 0 0 10px; font-size: 14px;">
                        ¿Tienes preguntas? Contáctanos en <a href="mailto:${EMAIL_CONFIG.replyTo}" style="color: #667eea; text-decoration: none;">${EMAIL_CONFIG.replyTo}</a>
                      </p>
                      <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                        © ${new Date().getFullYear()} ${EMAIL_CONFIG.companyName}. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: `Confirmación de Pedido - ${orderNumber}`,
      html,
    });

    if (error) {
      console.error('❌ Error sending order confirmation email:', error);
      return { success: false, error };
    }

    console.log(`✅ Order confirmation email sent to ${to} (${data?.id})`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in sendOrderConfirmationEmail:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a ${EMAIL_CONFIG.companyName}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                        ${EMAIL_CONFIG.companyName}
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #111827; margin: 0 0 20px; font-size: 24px;">
                        ¡Bienvenido, ${name}!
                      </h2>
                      <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px; line-height: 1.8;">
                        Gracias por registrarte en <strong>${EMAIL_CONFIG.companyName}</strong>. Estamos emocionados de tenerte con nosotros.
                      </p>
                      <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px; line-height: 1.8;">
                        Somos especialistas en bordados personalizados de toallas y otras prendas. Cada producto es único y hecho especialmente para ti.
                      </p>
                      
                      <div style="background-color: #f9fafb; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                        <h3 style="color: #111827; margin: 0 0 10px; font-size: 18px;">
                          ¿Qué puedes hacer ahora?
                        </h3>
                        <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.8;">
                          <li>Explora nuestro catálogo de productos</li>
                          <li>Personaliza tus toallas con bordados únicos</li>
                          <li>Realiza tu primer pedido</li>
                          <li>Guarda tus productos favoritos</li>
                        </ul>
                      </div>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${EMAIL_CONFIG.companyUrl}/products" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          Ver Productos
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; margin: 0 0 10px; font-size: 14px;">
                        ¿Necesitas ayuda? Contáctanos en <a href="mailto:${EMAIL_CONFIG.replyTo}" style="color: #667eea; text-decoration: none;">${EMAIL_CONFIG.replyTo}</a>
                      </p>
                      <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                        © ${new Date().getFullYear()} ${EMAIL_CONFIG.companyName}. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: `¡Bienvenido a ${EMAIL_CONFIG.companyName}!`,
      html,
    });

    if (error) {
      console.error('❌ Error sending welcome email:', error);
      return { success: false, error };
    }

    console.log(`✅ Welcome email sent to ${to} (${data?.id})`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in sendWelcomeEmail:', error);
    return { success: false, error };
  }
}

export { resend };
