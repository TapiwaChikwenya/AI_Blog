import sgMail from '@sendgrid/mail';
import { trackEmailOpen } from './db.js';

if (!import.meta.env.SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY is not set');
}

sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

export async function sendConfirmationEmail(email, token) {
  const confirmUrl = `${import.meta.env.PUBLIC_SITE_URL}/confirm?token=${token}`;
  
  try {
    await sgMail.send({
      to: email,
      from: import.meta.env.FROM_EMAIL,
      subject: 'Confirm your subscription to AI News Weekly',
      html: `
        <h1>Welcome to AI News Weekly!</h1>
        <p>Please click the button below to confirm your subscription:</p>
        <p>
          <a href="${confirmUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Confirm Subscription
          </a>
        </p>
      `
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendNewsletter(subscribers, subject, content, templateId = 1) {
  const emails = subscribers.map(sub => sub.email);
  const trackingPixel = `<img src="${import.meta.env.PUBLIC_SITE_URL}/api/track-open?sid={{subscriberId}}&nid={{newsletterId}}" width="1" height="1" />`;
  
  try {
    await sgMail.sendMultiple({
      to: emails,
      from: import.meta.env.FROM_EMAIL || 'news@ainewsweekly.com',
      subject,
      html: content + trackingPixel,
      asm: {
        group_id: parseInt(import.meta.env.SENDGRID_UNSUBSCRIBE_GROUP_ID || '0')
      },
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return { success: false, error: error.message };
  }
}