import { directus } from '../directus.js';
import { readSingleton } from '@directus/sdk';

/**
 * Get about page content
 * @returns {Promise<Object>} About page content object
 */
export async function getAboutPage() {
	try {
		const about = await directus.request(
			readSingleton('about', {
				fields: ['*', 'translations.*']
			})
		);
		return about;
	} catch (error) {
		console.error('Error fetching about page:', error);
		throw error;
	}
}
