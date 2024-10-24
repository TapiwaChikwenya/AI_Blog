import { trackEmailOpen } from '../../lib/db.js';

export async function GET({ request }) {
  const url = new URL(request.url);
  const subscriberId = url.searchParams.get('sid');
  const newsletterId = url.searchParams.get('nid');

  if (subscriberId && newsletterId) {
    await trackEmailOpen(subscriberId, newsletterId);
  }

  // Return a 1x1 transparent GIF
  return new Response(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'), {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}