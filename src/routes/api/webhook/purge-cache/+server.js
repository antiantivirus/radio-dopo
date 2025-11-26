import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

/**
 * Webhook endpoint to purge Cloudflare cache when Directus content changes
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
  try {
    const WEBHOOK_SECRET = env.DIRECTUS_WEBHOOK_SECRET;
    const ZONE_ID = env.CLOUDFLARE_ZONE_ID;
    const API_TOKEN = env.CLOUDFLARE_API_TOKEN;
    const SITE_URL = publicEnv.PUBLIC_SITE_URL;

    if (!WEBHOOK_SECRET || !ZONE_ID || !API_TOKEN) {
      throw new Error('Missing required environment variables');
    }

    // Verify webhook secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      console.error('Unauthorized webhook attempt');
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const { collection, keys, event } = payload;

    console.log('Webhook received:', { collection, keys, event });

    // Base site URL - fallback to production if not set
    const baseUrl = SITE_URL || 'https://radiodopo.it';

    // Determine which URLs to purge based on collection
    const urlsToPurge = new Set([`${baseUrl}/`]); // Always purge homepage

    switch (collection) {
      case 'shows':
        // Purge shows list page
        urlsToPurge.add(`${baseUrl}/shows`);

        // Purge individual show pages
        if (keys && keys.length > 0) {
          for (const key of keys) {
            // Purge the show detail page
            urlsToPurge.add(`${baseUrl}/shows/${key}`);
          }
        }
        break;

      case 'episodes':
        // Purge episodes list page
        urlsToPurge.add(`${baseUrl}/episodes`);

        // Purge individual episode pages
        if (keys && keys.length > 0) {
          for (const key of keys) {
            urlsToPurge.add(`${baseUrl}/episodes/${key}`);
          }
        }
        break;

      case 'about':
        // Purge about page
        urlsToPurge.add(`${baseUrl}/about`);
        break;

      case 'partners':
        // Purge partners page
        urlsToPurge.add(`${baseUrl}/partners`);
        break;

      case 'home':
        // Home singleton - only purge homepage
        // Already added above
        break;

      default:
        console.warn(`Unknown collection: ${collection}`);
    }

    const urlsArray = Array.from(urlsToPurge);

    console.log('Purging URLs:', urlsArray);

    // Purge the cache in Cloudflare
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: urlsArray
        })
      }
    );

    const result = await response.json();

    if (!result.success) {
      console.error('Cloudflare cache purge failed:', result);
      return json({
        error: 'Cache purge failed',
        details: result
      }, { status: 500 });
    }

    console.log('Cache purge successful');

    return json({
      success: true,
      purged: urlsArray,
      collection,
      event,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return json({
      error: 'Internal server error',
      message: String(error)
    }, { status: 500 });
  }
}
