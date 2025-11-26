import { getEpisodeBySlug } from '$lib/queries/episodes.js';
import { getAssetUrl } from '$lib/directus.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { slug } = params;

	try {
		const episode = await getEpisodeBySlug(slug);

		if (!episode) {
			throw error(404, 'Episode not found');
		}

		// Get description from episode or generate one
		const description = episode.translations?.[0]?.description ||
			`Listen to ${episode.title}${episode.show ? ` from ${episode.show.name}` : ''} on Radio Dopo.`;

		// Get image URL - use show image if available, otherwise fallback
		const image = episode.show?.image ? getAssetUrl(episode.show.image) : '/images/og-image.jpg';

		return {
			episode,
			title: `${episode.title} - Radio Dopo`,
			description,
			image
		};
	} catch (err) {
		console.error('Error fetching episode data:', err);
		throw error(404, 'Episode not found');
	}
}
