import { json, error } from '@sveltejs/kit';
import { directus } from '$lib/directus.js';
import { readItems } from '@directus/sdk';
import { sendShowInfoRequest } from '$lib/server/email.js';
import { addDays, format, startOfDay, endOfDay } from 'date-fns';

/**
 * API route to send episode info reminders
 * This can be called by a cron job or manually
 */
export async function POST({ request, url }) {
	// Optional: Add authentication/secret verification
	const authHeader = request.headers.get('authorization');
	const expectedSecret = process.env.CRON_SECRET;

	if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
		throw error(401, 'Unauthorized');
	}

	const baseUrl = url.origin;

	try {
		// Calculate date range for episodes in 2 weeks
		const twoWeeksFromNow = addDays(new Date(), 14);
		const startDate = startOfDay(twoWeeksFromNow);
		const endDate = endOfDay(twoWeeksFromNow);

		// Fetch episodes scheduled for 2 weeks from now
		const episodes = await directus.request(
			readItems('episodes', {
				filter: {
					start: {
						_between: [startDate.toISOString(), endDate.toISOString()]
					},
					status: {
						_neq: 'archived' // Don't send reminders for archived episodes
					}
				},
				fields: [
					'id',
					'title',
					'start',
					'show_id.id',
					'show_id.name',
					'show_id.slug',
					'show_id.email' // This field needs to be added to Directus shows collection
				]
			})
		);

		const results = [];
		const errors = [];

		// Send email for each episode
		for (const episode of episodes) {
			// Skip if show doesn't have an email
			if (!episode.show_id?.email) {
				errors.push({
					episodeId: episode.id,
					error: 'No email configured for show',
					showName: episode.show_id?.name
				});
				continue;
			}

			try {
				await sendShowInfoRequest({
					to: episode.show_id.email,
					showName: episode.show_id.name,
					episodeTitle: episode.title || 'Untitled Episode',
					episodeDate: format(new Date(episode.start), 'MMMM d, yyyy'),
					episodeId: episode.id,
					baseUrl
				});

				results.push({
					episodeId: episode.id,
					showName: episode.show_id.name,
					email: episode.show_id.email,
					sent: true
				});
			} catch (err) {
				console.error(`Failed to send email for episode ${episode.id}:`, err);
				errors.push({
					episodeId: episode.id,
					error: err.message,
					showName: episode.show_id?.name
				});
			}
		}

		return json({
			success: true,
			totalEpisodes: episodes.length,
			emailsSent: results.length,
			results,
			errors: errors.length > 0 ? errors : undefined
		});
	} catch (err) {
		console.error('Error in send-episode-reminders:', err);
		throw error(500, `Failed to process reminders: ${err.message}`);
	}
}
