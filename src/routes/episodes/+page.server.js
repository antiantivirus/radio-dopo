import { getEpisodes } from '$lib/queries/episodes.js';

export async function load({ url }) {
	const limit = parseInt(url.searchParams.get('limit') || '20');
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const search = url.searchParams.get('search') || '';

	try {
		const episodes = await getEpisodes(limit, offset, search);

		return {
			episodes,
			hasMore: episodes.length === limit,
			title: 'Episodes - Radio Dopo'
		};
	} catch (err) {
		console.error('Error fetching episodes:', err);
		throw err;
	}
}
