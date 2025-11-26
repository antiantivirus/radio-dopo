import { getEpisodes } from '$lib/queries/episodes.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const search = url.searchParams.get('search') || '';

  try {
    const episodes = await getEpisodes(limit, offset, search);

    return json({
      episodes,
      hasMore: episodes.length === limit
    });
  } catch (err) {
    console.error('Error fetching episodes:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
