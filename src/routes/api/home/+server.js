import { getHomeContent } from '$lib/queries/home.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const home = await getHomeContent();
    return json(home);
  } catch (error) {
    console.error('Error fetching home content:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
