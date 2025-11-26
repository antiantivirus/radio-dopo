import { getShowBySlug } from '$lib/queries/shows.js';
import { getAssetUrl } from '$lib/directus.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { slug } = params;

	try {
		const show = await getShowBySlug(slug);

		if (!show) {
			throw error(404, 'Show not found');
		}

		// Filter episodes to only show ones with audio
		const episodesWithAudio = (show.episodes || []).filter(episode => episode.audio);

		// Get description from show translations if available
		const description = show.translations?.[0]?.description ||
			`Listen to episodes from ${show.name} on Radio Dopo.`;

		// Get image URL if show has an image
		const image = show.image ? getAssetUrl(show.image) : '/images/og-image.jpg';

		return {
			show,
			episodes: episodesWithAudio,
			title: `${show.name} - Radio Dopo`,
			description,
			image
		};
	} catch (err) {
		console.error('Error fetching show data:', err);
		throw error(404, 'Show not found');
	}
}
