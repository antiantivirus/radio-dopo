import { directus } from '$lib/directus.js';
import { readItem, updateItem, uploadFiles, createItem } from '@directus/sdk';
import { error, fail } from '@sveltejs/kit';

export async function load({ params }) {
	const episodeId = params.id;

	try {
		// Fetch episode with show information using readItem
		const episode = await directus.request(
			readItem('episodes', episodeId, {
				fields: ['id', 'title', 'image', 'start', 'end', 'translations.*', 'show_id.id', 'show_id.name', 'show_id.slug']
			})
		);

		if (!episode) {
			throw error(404, 'Episode not found');
		}

		return {
			episode
		};
	} catch (err) {
		console.error('Error loading episode:', err);

		// If it's already an HTTP error, rethrow it
		if (err.status) {
			throw err;
		}

		throw error(404, `Episode not found: ${err.message || 'Unknown error'}`);
	}
}

export const actions = {
	submit: async ({ request, params }) => {
		const episodeId = params.id;
		const formData = await request.formData();

		const title = formData.get('title');
		const descriptionEn = formData.get('description_en');
		const descriptionIt = formData.get('description_it');
		const imageFile = formData.get('image');

		// Validate required fields
		if (!title || title.trim() === '') {
			return fail(400, {
				error: 'Episode title is required.',
				title,
				description_en: descriptionEn,
				description_it: descriptionIt
			});
		}

		// At least one description is required
		const hasEnDescription = descriptionEn && descriptionEn.trim() !== '';
		const hasItDescription = descriptionIt && descriptionIt.trim() !== '';

		if (!hasEnDescription && !hasItDescription) {
			return fail(400, {
				error: 'At least one description (EN or IT) is required.',
				title,
				description_en: descriptionEn,
				description_it: descriptionIt
			});
		}

		if (!imageFile || imageFile.size === 0) {
			return fail(400, {
				error: 'Episode image is required.',
				title,
				description_en: descriptionEn,
				description_it: descriptionIt
			});
		}

		try {
			// First, get the current episode to check existing translations
			const currentEpisode = await directus.request(
				readItem('episodes', episodeId, {
					fields: ['id', 'translations.*']
				})
			);

			const updateData = {
				title: title.trim()
			};

			// Handle image upload
			const formDataForUpload = new FormData();
			formDataForUpload.append('file', imageFile);

			const uploadedFile = await directus.request(uploadFiles(formDataForUpload));

			if (uploadedFile && uploadedFile.id) {
				updateData.image = uploadedFile.id;
			}

			// Update episode in Directus
			await directus.request(updateItem('episodes', episodeId, updateData));

			// Handle translations (description goes in translations)
			// Check if translations exist for both languages
			const enTranslation = currentEpisode.translations?.find(
				(/** @type {{ languages_code: string }} */ t) => t.languages_code === 'en-US'
			);
			const itTranslation = currentEpisode.translations?.find(
				(/** @type {{ languages_code: string }} */ t) => t.languages_code === 'it-IT'
			);

			const baseTranslationData = {
				title: title.trim()
			};

			// Update or create English translation (if description provided)
			if (hasEnDescription) {
				const enTranslationData = {
					...baseTranslationData,
					description: descriptionEn.trim()
				};

				if (enTranslation) {
					await directus.request(
						updateItem('episodes_translations', enTranslation.id, enTranslationData)
					);
				} else {
					await directus.request(
						createItem('episodes_translations', {
							...enTranslationData,
							episodes_id: episodeId,
							languages_code: 'en-US'
						})
					);
				}
			}

			// Update or create Italian translation (if description provided)
			if (hasItDescription) {
				const itTranslationData = {
					...baseTranslationData,
					description: descriptionIt.trim()
				};

				if (itTranslation) {
					await directus.request(
						updateItem('episodes_translations', itTranslation.id, itTranslationData)
					);
				} else {
					await directus.request(
						createItem('episodes_translations', {
							...itTranslationData,
							episodes_id: episodeId,
							languages_code: 'it-IT'
						})
					);
				}
			}

			return { success: true };
		} catch (err) {
			console.error('Error updating episode:', err);
			return fail(500, {
				error: 'Failed to update episode. Please try again.',
				title,
				description_en: descriptionEn,
				description_it: descriptionIt
			});
		}
	}
};
