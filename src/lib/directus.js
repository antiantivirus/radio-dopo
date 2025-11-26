import { createDirectus, rest, readItems, readItem } from '@directus/sdk';

/**
 * Directus Configuration
 * Update this URL when your Directus instance changes
 */
export const DIRECTUS_URL = 'https://cms.radiodopo.it';

/**
 * Create a Directus client instance
 * This is a singleton that can be used throughout the application
 */
export const directus = createDirectus(DIRECTUS_URL).with(rest());

/**
 * Type definitions for our collections
 * These help with autocomplete and type safety
 */

/**
 * @typedef {Object} Show
 * @property {number} id
 * @property {string} slug
 * @property {string} name
 * @property {string} frequency
 * @property {string} image
 * @property {string} description
 */

/**
 * @typedef {Object} Episode
 * @property {number} id
 * @property {string} slug
 * @property {string} title
 * @property {string} start - Start date/time
 * @property {string} end - End date/time
 * @property {string} audio - Audio file ID
 * @property {string} description
 * @property {string|number} show_id - ID of the show this episode belongs to
 */

/**
 * S3 Media Server URL
 * This is where your files are actually stored
 */
export const MEDIA_URL = 'https://media.radiodopo.it';

/**
 * Get the full URL for a Directus asset from the media server
 * @param {string} filenameDisk - The filename_disk value from Directus
 * @returns {string} Full URL to the asset
 */
export function getAssetUrl(filenameDisk) {
	return `${MEDIA_URL}/media/assets/${filenameDisk}`;
}
