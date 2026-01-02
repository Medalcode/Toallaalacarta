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

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({
  to,
  name,
  resetToken,
}: {
  to: string;
  name: string;
  resetToken: string;
}) {
  try {
    const resetUrl = `${EMAIL_CONFIG.companyUrl}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperar Contraseña - ${EMAIL_CONFIG.companyName}</title>
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
                  
                  <!-- Icon -->
                  <tr>
                    <td style="padding: 40px 30px 20px; text-align: center;">
                      <div style="width: 80px; height: 80px; background-color: #fbbf24; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 0 30px 30px;">
                      <h2 style="color: #111827; margin: 0 0 20px; font-size: 24px; text-align: center;">
                        Recuperar Contraseña
                      </h2>
                      <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px; line-height: 1.8;">
                        Hola ${name},
                      </p>
                      <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px; line-height: 1.8;">
                        Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>${EMAIL_CONFIG.companyName}</strong>.
                      </p>
                      <p style="color: #6b7280; margin: 0 0 30px; font-size: 16px; line-height: 1.8;">
                        Haz clic en el botón de abajo para crear una nueva contraseña:
                      </p>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          Restablecer Contraseña
                        </a>
                      </div>
                      
                      <!-- Alternative Link -->
                      <p style="color: #9ca3af; margin: 30px 0 0; font-size: 14px; line-height: 1.6; text-align: center;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                        <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
                      </p>
                      
                      <!-- Warning -->
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 4px;">
                        <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                          <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por seguridad.
                        </p>
                      </div>
                      
                      <p style="color: #6b7280; margin: 20px 0 0; font-size: 14px; line-height: 1.6;">
                        Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.
                      </p>
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
      subject: `Recuperar Contraseña - ${EMAIL_CONFIG.companyName}`,
      html,
    });

    if (error) {
      console.error('❌ Error sending password reset email:', error);
      return { success: false, error };
    }

    console.log(`✅ Password reset email sent to ${to} (${data?.id})`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in sendPasswordResetEmail:', error);
    return { success: false, error };
  }
}

/**
 * Send order status update email - Processing
 */
export async function sendOrderProcessingEmail({
  to,
  orderNumber,
  customerName,
}: {
  to: string;
  orderNumber: string;
  customerName: string;
}) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tu pedido está en proceso - ${orderNumber}</title>
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
                  
                  <!-- Icon -->
                  <tr>
                    <td style="padding: 40px 30px 20px; text-align: center;">
                      <div style="width: 80px; height: 80px; background-color: #3b82f6; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 0 30px 30px;">
                      <h2 style="color: #111827; margin: 0 0 20px; font-size: 24px; text-align: center;">
                        ¡Tu pedido está en proceso!
                      </h2>
                      <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px; line-height: 1.8;">
                        Hola ${customerName},
                      </p>
                      <p style="color: #6b7280; margin: 0 0 30px; font-size: 16px; line-height: 1.8;">
                        Queremos informarte que tu pedido <strong>${orderNumber}</strong> está siendo preparado con el bordado personalizado que solicitaste.
                      </p>
                      
                      <!-- Order Number -->
                      <div style="background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                        <p style="color: #1e40af; margin: 0 0 5px; font-size: 14px; font-weight: 500;">
                          Número de Orden
                        </p>
                        <p style="color: #3b82f6; margin: 0; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace;">
                          ${orderNumber}
                        </p>
                      </div>
                      
                      <!-- Timeline -->
                      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                        <h3 style="color: #111827; margin: 0 0 15px; font-size: 18px;">
                          Estado del Pedido
                        </h3>
                        <div style="position: relative; padding-left: 30px;">
                          <div style="position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background-color: #e5e7eb;"></div>
                          
                          <div style="position: relative; margin-bottom: 20px;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #10b981; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #10b981; font-weight: 600;">✓ Pedido Recibido</p>
                          </div>
                          
                          <div style="position: relative; margin-bottom: 20px;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #3b82f6; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #3b82f6; font-weight: 600;">→ En Proceso (Actual)</p>
                            <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">Preparando tu bordado personalizado</p>
                          </div>
                          
                          <div style="position: relative; margin-bottom: 20px;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #e5e7eb; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #9ca3af; font-weight: 600;">Enviado</p>
                          </div>
                          
                          <div style="position: relative;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #e5e7eb; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #9ca3af; font-weight: 600;">Entregado</p>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Info Box -->
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 4px;">
                        <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                          <strong>⏱️ Tiempo estimado:</strong> Los bordados personalizados pueden tomar entre 3-5 días hábiles. Te notificaremos cuando tu pedido sea enviado.
                        </p>
                      </div>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${EMAIL_CONFIG.companyUrl}/account" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          Ver Estado del Pedido
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
      subject: `Tu pedido está en proceso - ${orderNumber}`,
      html,
    });

    if (error) {
      console.error('❌ Error sending processing email:', error);
      return { success: false, error };
    }

    console.log(`✅ Processing email sent to ${to} (${data?.id})`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in sendOrderProcessingEmail:', error);
    return { success: false, error };
  }
}

/**
 * Send order status update email - Shipped
 */
export async function sendOrderShippedEmail({
  to,
  orderNumber,
  customerName,
  trackingNumber,
}: {
  to: string;
  orderNumber: string;
  customerName: string;
  trackingNumber?: string;
}) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tu pedido ha sido enviado - ${orderNumber}</title>
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
                  
                  <!-- Icon -->
                  <tr>
                    <td style="padding: 40px 30px 20px; text-align: center;">
                      <div style="width: 80px; height: 80px; background-color: #8b5cf6; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 0 30px 30px;">
                      <h2 style="color: #111827; margin: 0 0 20px; font-size: 24px; text-align: center;">
                        ¡Tu pedido está en camino!
                      </h2>
                      <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px; line-height: 1.8;">
                        Hola ${customerName},
                      </p>
                      <p style="color: #6b7280; margin: 0 0 30px; font-size: 16px; line-height: 1.8;">
                        ¡Buenas noticias! Tu pedido <strong>${orderNumber}</strong> ha sido enviado y está en camino a tu dirección.
                      </p>
                      
                      <!-- Order Number -->
                      <div style="background-color: #f5f3ff; border: 2px solid #8b5cf6; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                        <p style="color: #6d28d9; margin: 0 0 5px; font-size: 14px; font-weight: 500;">
                          Número de Orden
                        </p>
                        <p style="color: #8b5cf6; margin: 0; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace;">
                          ${orderNumber}
                        </p>
                      </div>
                      
                      ${trackingNumber ? `
                      <!-- Tracking Number -->
                      <div style="background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                        <p style="color: #1e40af; margin: 0 0 10px; font-size: 14px; font-weight: 500;">
                          📦 Número de Seguimiento
                        </p>
                        <p style="color: #3b82f6; margin: 0; font-size: 20px; font-weight: bold; font-family: 'Courier New', monospace;">
                          ${trackingNumber}
                        </p>
                        <p style="color: #6b7280; margin: 10px 0 0; font-size: 14px;">
                          Usa este número para rastrear tu envío
                        </p>
                      </div>
                      ` : ''}
                      
                      <!-- Timeline -->
                      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                        <h3 style="color: #111827; margin: 0 0 15px; font-size: 18px;">
                          Estado del Pedido
                        </h3>
                        <div style="position: relative; padding-left: 30px;">
                          <div style="position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background-color: #e5e7eb;"></div>
                          
                          <div style="position: relative; margin-bottom: 20px;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #10b981; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #10b981; font-weight: 600;">✓ Pedido Recibido</p>
                          </div>
                          
                          <div style="position: relative; margin-bottom: 20px;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #10b981; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #10b981; font-weight: 600;">✓ En Proceso</p>
                          </div>
                          
                          <div style="position: relative; margin-bottom: 20px;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #8b5cf6; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #8b5cf6; font-weight: 600;">→ Enviado (Actual)</p>
                            <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">En camino a tu dirección</p>
                          </div>
                          
                          <div style="position: relative;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #e5e7eb; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #9ca3af; font-weight: 600;">Entregado</p>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Info Box -->
                      <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 30px 0; border-radius: 4px;">
                        <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
                          <strong>📍 Tiempo de entrega:</strong> Tu pedido debería llegar en los próximos 2-5 días hábiles, dependiendo de tu ubicación.
                        </p>
                      </div>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${EMAIL_CONFIG.companyUrl}/account" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          Ver Estado del Pedido
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
      subject: `Tu pedido ha sido enviado - ${orderNumber}`,
      html,
    });

    if (error) {
      console.error('❌ Error sending shipped email:', error);
      return { success: false, error };
    }

    console.log(`✅ Shipped email sent to ${to} (${data?.id})`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in sendOrderShippedEmail:', error);
    return { success: false, error };
  }
}

/**
 * Send order status update email - Delivered
 */
export async function sendOrderDeliveredEmail({
  to,
  orderNumber,
  customerName,
}: {
  to: string;
  orderNumber: string;
  customerName: string;
}) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tu pedido ha sido entregado - ${orderNumber}</title>
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
                  
                  <!-- Icon -->
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
                      <h2 style="color: #111827; margin: 0 0 20px; font-size: 24px; text-align: center;">
                        ¡Tu pedido ha sido entregado!
                      </h2>
                      <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px; line-height: 1.8;">
                        Hola ${customerName},
                      </p>
                      <p style="color: #6b7280; margin: 0 0 30px; font-size: 16px; line-height: 1.8;">
                        ¡Excelentes noticias! Tu pedido <strong>${orderNumber}</strong> ha sido entregado exitosamente. Esperamos que disfrutes tu bordado personalizado.
                      </p>
                      
                      <!-- Order Number -->
                      <div style="background-color: #d1fae5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                        <p style="color: #065f46; margin: 0 0 5px; font-size: 14px; font-weight: 500;">
                          Número de Orden
                        </p>
                        <p style="color: #10b981; margin: 0; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace;">
                          ${orderNumber}
                        </p>
                      </div>
                      
                      <!-- Timeline -->
                      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                        <h3 style="color: #111827; margin: 0 0 15px; font-size: 18px;">
                          Estado del Pedido
                        </h3>
                        <div style="position: relative; padding-left: 30px;">
                          <div style="position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background-color: #10b981;"></div>
                          
                          <div style="position: relative; margin-bottom: 20px;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #10b981; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #10b981; font-weight: 600;">✓ Pedido Recibido</p>
                          </div>
                          
                          <div style="position: relative; margin-bottom: 20px;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #10b981; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #10b981; font-weight: 600;">✓ En Proceso</p>
                          </div>
                          
                          <div style="position: relative; margin-bottom: 20px;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #10b981; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #10b981; font-weight: 600;">✓ Enviado</p>
                          </div>
                          
                          <div style="position: relative;">
                            <div style="position: absolute; left: -26px; width: 16px; height: 16px; background-color: #10b981; border-radius: 50%; border: 3px solid #ffffff;"></div>
                            <p style="margin: 0; color: #10b981; font-weight: 600;">✓ Entregado (Completado)</p>
                            <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">¡Disfruta tu pedido!</p>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Feedback Request -->
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 4px;">
                        <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                          <strong>💬 Tu opinión es importante:</strong> ¿Qué te pareció tu pedido? Nos encantaría conocer tu experiencia.
                        </p>
                      </div>
                      
                      <!-- CTA Buttons -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${EMAIL_CONFIG.companyUrl}/products" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 5px;">
                          Ver Más Productos
                        </a>
                      </div>
                      
                      <p style="color: #6b7280; margin: 30px 0 0; font-size: 14px; text-align: center; line-height: 1.6;">
                        ¡Gracias por confiar en nosotros! Esperamos verte pronto.
                      </p>
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
      subject: `Tu pedido ha sido entregado - ${orderNumber}`,
      html,
    });

    if (error) {
      console.error('❌ Error sending delivered email:', error);
      return { success: false, error };
    }

    console.log(`✅ Delivered email sent to ${to} (${data?.id})`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in sendOrderDeliveredEmail:', error);
    return { success: false, error };
  }
}

export { resend };
