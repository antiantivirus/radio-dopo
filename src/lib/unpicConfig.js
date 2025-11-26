import { DIRECTUS_URL } from './directus.js';

/**
 * Directus image transformer for @unpic/svelte
 * This function handles Directus image URLs and applies transformations
 * using Directus's built-in image transformation API
 * @param {string|object} url - The image URL, filename, or Directus file object
 * @returns {string} The full Directus asset URL
 */
export function directusTransformer(url) {
  console.log('directusTransformer received:', url, 'type:', typeof url);

  // Handle null/undefined
  if (!url) {
    console.log('directusTransformer: url is null/undefined');
    return '';
  }

  // If it's a Directus file object, extract the filename_disk or id
  if (typeof url === 'object') {
    console.log('directusTransformer: url is object, extracting fields...');
    console.log('  filename_disk:', url.filename_disk);
    console.log('  id:', url.id);
    console.log('  filename:', url.filename);
    url = url.filename_disk || url.id || url.filename || '';
    console.log('  extracted value:', url);
  }

  // Ensure url is now a string
  if (typeof url !== 'string') {
    console.error('Invalid image URL:', url);
    return '';
  }

  // If the URL is already a full URL from Directus CMS, use it as-is
  if (url.startsWith(DIRECTUS_URL) || url.startsWith('http')) {
    console.log('directusTransformer: returning full URL:', url);
    return url;
  }

  // If it's a relative path or filename, construct the full URL
  let assetId = url;

  // Handle different URL formats
  if (url.includes('assets/')) {
    // Extract filename after 'assets/'
    assetId = url.split('assets/')[1];
  }

  // Build the Directus assets URL using the CMS URL
  const finalUrl = `${DIRECTUS_URL}/assets/${assetId}`;
  console.log('directusTransformer: constructed URL:', finalUrl);
  return finalUrl;
}

/**
 * Default props for Directus images
 * These can be spread onto the Image component from @unpic/svelte
 */
export const directusImageDefaults = {
  cdn: 'directus',
  layout: 'constrained',
  background: 'auto'
};
