import { getPartnersPage } from '$lib/queries/partners.js';

export async function load() {
	try {
		const partners = await getPartnersPage();

		return {
			partners,
			title: 'Partners - Radio Dopo'
		};
	} catch (err) {
		console.error('Error fetching partners page:', err);
		throw err;
	}
}
