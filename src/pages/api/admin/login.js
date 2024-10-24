import { verifyAdminCredentials, initializeAdminTable, getAllAdminUsers, getAdminUser } from '../../../lib/admin-db.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Initialize admin table
initializeAdminTable();

// Temporarily log admin users for debugging
console.log('Admin users:', getAllAdminUsers());

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    const schema = z.object({
      username: z.string().min(1),
      password: z.string().min(1)
    });
    
    const { username, password } = schema.parse(data);
    
    console.log('Attempting login for user:', username);
    const user = getAdminUser(username);
    console.log('User details:', user);
    
    if (verifyAdminCredentials(username, password)) {
      console.log('Login successful for user:', username);
      const token = jwt.sign({ username }, import.meta.env.JWT_SECRET, { expiresIn: '1h' });
      
      return new Response(JSON.stringify({ token }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
