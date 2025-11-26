import { directus } from '../directus.js';
import { readSingleton } from '@directus/sdk';

/**
 * Get partners page content
 * @returns {Promise<Object>} Partners page content object
 */
export async function getPartnersPage() {
	try {
		const partners = await directus.request(
			readSingleton('partners', {
				fields: ['*', 'translations.*']
			})
		);
		return partners;
	} catch (error) {
		console.error('Error fetching partners page:', error);
		throw error;
	}
}
