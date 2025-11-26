import { directus } from '../directus.js';
import { readItems, readSingleton } from '@directus/sdk';

/**
 * Get home page content
 * Note: If 'home' is a singleton collection in Directus, use getHomeSingleton instead
 * @returns {Promise<Object>} Home page content object
 */
export async function getHomeContent() {
	try {
		const home = await directus.request(
			readSingleton('home', {
				fields: ['*', 'images.*']
			})
		);
		return home;
	} catch (error) {
		console.error('Error fetching home content:', error);
		throw error;
	}
}
