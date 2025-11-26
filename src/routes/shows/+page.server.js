import { getShows } from '$lib/queries/shows.js';

export async function load({ url }) {
	const limit = parseInt(url.searchParams.get('limit') || '20');
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const search = url.searchParams.get('search') || '';

	try {
		const shows = await getShows(limit, offset, search);

		return {
			shows,
			hasMore: shows.length === limit,
			title: 'Shows - Radio Dopo'
		};
	} catch (err) {
		console.error('Error fetching shows:', err);
		throw err;
	}
}
