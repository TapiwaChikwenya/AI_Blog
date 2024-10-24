import jwt from 'jsonwebtoken';

export function isAuthenticated(request) {
  const cookies = request.headers.get('cookie');
  if (!cookies) return false;

  const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
  if (!tokenCookie) return false;

  const token = tokenCookie.split('=')[1];
  try {
    jwt.verify(token, import.meta.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}
