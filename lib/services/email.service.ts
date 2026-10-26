import { Order } from '@/types';
import { env } from '@/lib/config/env';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string }> {
  // If email API key is not configured, safely log to console in development
  if (!env.EMAIL_PROVIDER_API_KEY) {
    console.log(`[EMAIL DISPATCH - DEV LOG] To: ${payload.to} | Subject: "${payload.subject}"`);
    return { success: true, id: `dev_email_${Date.now()}` };
  }

  // In production, integrate with SendGrid, Resend, or AWS SES
  try {
    console.log(`Sending email to ${payload.to}: ${payload.subject}`);
    return { success: true, id: `prod_email_${Date.now()}` };
  } catch (error) {
    console.error('Failed to dispatch email:', error);
    return { success: false };
  }
}

export function generateOrderConfirmationHtml(order: Order): string {
  const itemsHtml = order.items
    .map(
      item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E8E2D8;">
          <strong style="color: #1A1816; font-size: 14px;">${item.name}</strong><br/>
          <span style="color: #7A7268; font-size: 12px;">Size: ${item.sizeLabel} • Condition: ${item.conditionGrade}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E8E2D8; text-align: right; color: #1A1816; font-size: 14px;">
          ₹${item.price.toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 40px 20px; color: #1A1816;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 26px; letter-spacing: 2px; text-transform: uppercase; margin: 0; color: #1A1816;">SECOND STORY</h1>
        <p style="font-size: 13px; color: #7A7268; margin-top: 6px; font-style: italic;">Pre-loved pieces. New stories.</p>
      </div>

      <div style="background: #FFFFFF; border: 1px solid #E8E2D8; padding: 32px; border-radius: 4px;">
        <h2 style="font-size: 20px; margin-top: 0; color: #3D4A3C;">Order Confirmed: #${order.orderNumber}</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #4A453E;">
          Thank you for choosing conscious fashion, <strong>${order.customer.name}</strong>. Your curated vintage piece is being carefully packed for shipment.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="padding-top: 16px; border-top: 2px solid #1A1816; font-family: sans-serif;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px;">
            <span>Subtotal:</span>
            <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
          </div>
          ${
            order.discountAmount > 0
              ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; color: #A34E36;">
            <span>Discount:</span>
            <span>-₹${order.discountAmount.toLocaleString('en-IN')}</span>
          </div>`
              : ''
          }
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px;">
            <span>Shipping:</span>
            <span>${order.shippingFee === 0 ? 'Complimentary' : `₹${order.shippingFee.toLocaleString('en-IN')}`}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 12px; font-weight: bold; font-size: 16px; border-top: 1px solid #E8E2D8; padding-top: 12px;">
            <span>Total:</span>
            <span>₹${order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style="margin-top: 24px; padding: 16px; background: #F8F5F0; border-radius: 4px; font-size: 13px;">
          <strong>Shipping to:</strong><br/>
          ${order.shippingAddress.fullName}<br/>
          ${order.shippingAddress.street}${order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ''}<br/>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.postalCode}
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #8E877D;">
        Questions about your garment? Reach us at care@secondstory.vintage
      </div>
    </div>
  `;
}

export function sendOrderConfirmationAsync(order: Order): void {
  // Dispatches asynchronously without blocking the user response
  setTimeout(async () => {
    try {
      await sendEmail({
        to: order.customer.email,
        subject: `Your Second Story Order #${order.orderNumber} is Confirmed`,
        html: generateOrderConfirmationHtml(order),
      });
    } catch (err) {
      console.error('Async order email error:', err);
    }
  }, 100);
}
