import { getAboutPage } from '$lib/queries/about.js';

export async function load() {
	try {
		const about = await getAboutPage();

		// Get description from about page content if available
		const description = about?.translations?.[0]?.content?.substring(0, 160) ||
			"Established in 2024, Radio Dopo is a Palermo-based community radio station, working with artists, cultural workers and non-profit organizations, borne from a partnership with like-minded community radio stations Kiosk Radio in Brussels and Refuge Worldwide in Berlin.";

		return {
			about,
			title: 'About - Radio Dopo',
			description
		};
	} catch (err) {
		console.error('Error fetching about page:', err);
		throw err;
	}
}
