import { env } from '$env/dynamic/public';

export async function GET() {
  try {
    const API_KEY = env.PUBLIC_GOOGLE_CALENDAR_API_KEY;
    const CALENDAR_ID = env.PUBLIC_GOOGLE_CALENDAR_ID;

    if (!API_KEY || !CALENDAR_ID) {
      throw new Error('Missing required environment variables');
    }

    // Get the current time and next 7 days
    const currentTime = new Date();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    // Build Google Calendar API URL
    const params = new URLSearchParams({
      key: API_KEY,
      timeMin: now.toISOString(),
      timeMax: nextWeek.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '100'
    });

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`;

    // Fetch events from Google Calendar API
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();

    // Transform events into the format expected by the frontend
    const events = [];
    let liveNow = null;

    (data.items || []).forEach(event => {
      // Handle both date-time and all-day events
      const startDateTime = event.start.dateTime || event.start.date;
      const endDateTime = event.end.dateTime || event.end.date;

      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);

      const eventData = {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        playlist: {
          title: event.summary || 'Untitled Show',
          name: event.summary || 'Untitled Show'
        },
        description: event.description || ''
      };

      events.push(eventData);

      // Check if this event is live now
      if (startDate <= currentTime && endDate >= currentTime) {
        liveNow = eventData;
      }
    });

    return new Response(JSON.stringify({
      data: events,
      liveNow: liveNow
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute
      }
    });
  } catch (error) {
    console.error('Error fetching Google Calendar:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch calendar data',
        message: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
