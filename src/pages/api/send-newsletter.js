import { getAllSubscribers } from '../../lib/db.js';
import { sendNewsletter } from '../../lib/email.js';
import { z } from 'zod';

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Validate input
    const schema = z.object({
      subject: z.string().min(1),
      content: z.string().min(1)
    });
    
    const { subject, content } = schema.parse(data);
    
    // Get all subscribers
    const subscribers = getAllSubscribers();
    
    // Send newsletter
    const result = await sendNewsletter(subscribers, subject, content);
    
    if (!result.success) {
      return new Response(JSON.stringify({
        error: result.error
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify({
      message: 'Newsletter sent successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}