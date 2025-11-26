import { getShows } from '$lib/queries/shows.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const search = url.searchParams.get('search') || '';

  try {
    const shows = await getShows(limit, offset, search);

    return json({
      shows,
      hasMore: shows.length === limit
    });
  } catch (err) {
    console.error('Error fetching shows:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
