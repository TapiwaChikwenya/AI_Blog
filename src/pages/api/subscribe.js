import { addSubscriber } from '../../lib/db.js';
import { z } from 'zod';

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Validate email
    const schema = z.object({
      email: z.string().email()
    });
    
    const { email } = schema.parse(data);
    
    const result = addSubscriber(email);
    
    if (!result.success) {
      return new Response(JSON.stringify({
        error: result.error
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify({
      message: 'Subscribed successfully'
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