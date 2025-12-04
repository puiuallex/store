import { Resend } from 'resend';

// Inițializează Resend cu API key-ul din variabilele de mediu
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Trimite un email de confirmare pentru o comandă nouă
 */
export async function sendOrderConfirmationEmail(orderData) {
  if (!resend) {
    console.warn('Resend nu este configurat. Email-ul nu va fi trimis.');
    return { success: false, error: 'Serviciul de email nu este configurat' };
  }

  if (!orderData.email) {
    return { success: false, error: 'Adresa de email este necesară' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: orderData.email,
      subject: `Comanda ta a fost primită cu succes - #${formatOrderId(orderData.orderId)}`,
      html: generateOrderConfirmationHTML(orderData),
    });

    if (error) {
      console.error('Eroare la trimiterea email-ului:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Eroare la trimiterea email-ului:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Trimite un email de notificare către admin când se plasează o comandă nouă
 */
export async function sendOrderNotificationToAdmin(orderData) {
  if (!resend) {
    return { success: false, error: 'Serviciul de email nu este configurat' };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return { success: false, error: 'Email-ul admin nu este configurat' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: adminEmail,
      subject: `Nouă comandă #${formatOrderId(orderData.orderId)}`,
      html: generateAdminNotificationHTML(orderData),
    });

    if (error) {
      console.error('Eroare la trimiterea email-ului către admin:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Eroare la trimiterea email-ului către admin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Trimite un email de newsletter
 */
export async function sendNewsletterEmail(subscriberEmail, subject, htmlContent) {
  if (!resend) {
    return { success: false, error: 'Serviciul de email nu este configurat' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: subscriberEmail,
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Eroare la trimiterea newsletter-ului:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Eroare la trimiterea newsletter-ului:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Formatează ID-ul comenzii pentru a fi mai scurt și ușor de citit
 * Folosește primele 8 caractere, la fel ca în restul aplicației
 */
function formatOrderId(orderId) {
  if (!orderId) return '';
  const idString = String(orderId);
  // Dacă este un UUID sau ID lung, afișează doar primele 8 caractere
  if (idString.length > 8) {
    return idString.slice(0, 8).toUpperCase();
  }
  return idString.toUpperCase();
}

/**
 * Generează HTML-ul pentru email-ul de confirmare a comenzii
 */
function generateOrderConfirmationHTML(orderData) {
  // Funcție helper pentru a trunchia textul
  const truncateText = (text, maxLength = 40) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  const itemsHTML = orderData.items.map(item => {
    const truncatedName = truncateText(item.product_name, 40);
    return `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
        <strong>${truncatedName}</strong>
        ${item.color ? `<br><span style="color: #6b7280; font-size: 13px;">Culoare: ${item.color}</span>` : ''}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px;">
            <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px 15px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Mulțumim pentru comandă!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; background-color: #f9fafb;">
                  <p style="font-size: 16px; margin: 0 0 10px 0;">Bună ziua,</p>
                  <p style="margin: 0 0 15px 0;">Comanda ta a fost primită cu succes și va fi procesată în cel mai scurt timp posibil.</p>
                  
                  <div style="background: white; padding: 15px; border-radius: 8px; margin: 0 0 15px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h2 style="margin: 0 0 10px 0; color: #059669; font-size: 18px;">Detalii comandă</h2>
                    <p style="margin: 5px 0;"><strong>Număr comandă:</strong> #${formatOrderId(orderData.orderId)}</p>
                    <p style="margin: 5px 0;"><strong>Data:</strong> ${new Date().toLocaleDateString('ro-RO', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>

                  <div style="background: white; padding: 15px; border-radius: 8px; margin: 0 0 15px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="margin: 0 0 10px 0; color: #059669; font-size: 16px;">Produse comandate</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      <thead>
                        <tr style="background: #f3f4f6;">
                          <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e5e7eb; font-size: 14px;">Produs</th>
                          <th style="padding: 8px; text-align: center; border-bottom: 2px solid #e5e7eb; font-size: 14px;">Cantitate</th>
                          <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e5e7eb; font-size: 14px;">Total (lei)</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHTML}
                      </tbody>
                    </table>
                  </div>

                  <div style="background: white; padding: 15px; border-radius: 8px; margin: 0 0 15px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="margin: 0 0 10px 0; color: #059669; font-size: 16px;">Adresă de livrare</h3>
                    <p style="margin: 5px 0;">
                      <strong>${orderData.shipping_address.fullName}</strong><br>
                      ${orderData.shipping_address.address}<br>
                      ${orderData.shipping_address.city}, ${orderData.shipping_address.county}<br>
                      ${orderData.shipping_address.postalCode}<br>
                      Telefon: ${orderData.shipping_address.phone}
                    </p>
                  </div>

                  <div style="background: white; padding: 15px; border-radius: 8px; margin: 0 0 15px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <table style="width: 100%;">
                      <tr>
                        <td style="padding: 5px 0;"><strong>Subtotal:</strong></td>
                        <td style="text-align: right; padding: 5px 0;">${orderData.subtotal.toFixed(2)} lei</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0;"><strong>Livrare:</strong></td>
                        <td style="text-align: right; padding: 5px 0;">${orderData.shipping_cost > 0 ? `${orderData.shipping_cost.toFixed(2)} lei` : 'Gratuit'}</td>
                      </tr>
                      <tr style="border-top: 2px solid #e5e7eb;">
                        <td style="padding: 10px 0;"><strong style="font-size: 18px;">Total:</strong></td>
                        <td style="text-align: right; padding: 10px 0;"><strong style="font-size: 18px; color: #059669;">${orderData.total.toFixed(2)} lei</strong></td>
                      </tr>
                    </table>
                  </div>

                  ${orderData.notes ? `
                    <div style="background: white; padding: 15px; border-radius: 8px; margin: 0 0 15px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                      <h3 style="margin: 0 0 10px 0; color: #059669; font-size: 16px;">Note</h3>
                      <p style="margin: 0;">${orderData.notes}</p>
                    </div>
                  ` : ''}

                  <p style="margin: 20px 0 10px 0;">Vei primi un email când comanda ta va fi expediată.</p>
                  <p style="margin: 0 0 20px 0;">Dacă ai întrebări, te rugăm să ne contactezi.</p>
                  
                  <p style="margin: 20px 0 0 0;">
                    Cu respect,<br>
                    Echipa creatinglayers.ro
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
}

/**
 * Generează HTML-ul pentru notificarea admin-ului
 */
function generateAdminNotificationHTML(orderData) {
  const itemsHTML = orderData.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.product_name}${item.color ? ` (${item.color})` : ''}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${(item.price * item.quantity).toFixed(2)} lei</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #dc2626;">Nouă comandă #${formatOrderId(orderData.orderId)}</h2>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Detalii comandă</h3>
        <p><strong>Număr comandă:</strong> #${formatOrderId(orderData.orderId)}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleDateString('ro-RO')}</p>
        <p><strong>Email client:</strong> ${orderData.email || 'N/A'}</p>
        <p><strong>Total:</strong> ${orderData.total.toFixed(2)} lei</p>
      </div>

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Produse</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #e5e7eb;">
              <th style="padding: 8px; text-align: left;">Produs</th>
              <th style="padding: 8px; text-align: center;">Cantitate</th>
              <th style="padding: 8px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Adresă de livrare</h3>
        <p>
          ${orderData.shipping_address.fullName}<br>
          ${orderData.shipping_address.address}<br>
          ${orderData.shipping_address.city}, ${orderData.shipping_address.county}<br>
          ${orderData.shipping_address.postalCode}<br>
          Telefon: ${orderData.shipping_address.phone}
        </p>
      </div>
    </body>
    </html>
  `;
}
