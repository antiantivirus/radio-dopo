<script>
  import { onMount } from "svelte";
  import { formatInUserTimeZone, getUserTimeZone } from "$lib/utils/dates.js";

  let schedule = $state([]);
  let scheduleByDay = $state({});
  let loading = $state(true);
  let userTimeZone = $state("");

  const SCHEDULE_API = "/api/schedule";

  function groupByDay(shows) {
    const grouped = {};
    shows.forEach((show) => {
      if (!show.start) return;

      const dayKey = formatInUserTimeZone(
        show.start,
        userTimeZone,
        "EEEE, d MMMM"
      );

      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(show);
    });
    return grouped;
  }

  async function fetchSchedule() {
    loading = true;
    try {
      const response = await fetch(SCHEDULE_API);
      const result = await response.json();

      if (result.data && Array.isArray(result.data)) {
        schedule = result.data;
        scheduleByDay = groupByDay(result.data);
      } else if (Array.isArray(result)) {
        schedule = result;
        scheduleByDay = groupByDay(result);
      }
      loading = false;
    } catch (error) {
      loading = false;
    }
  }

  onMount(() => {
    userTimeZone = getUserTimeZone();
    fetchSchedule();
  });
</script>

<div class="min-h-screen py-6">
  <div class="px-3 md:px-6">
    <header class="text-left mb-12">
      <h1 class="font-normal m-0 text-white uppercase tracking-[0.1em]">
        WEEKLY SCHEDULE
      </h1>
      <p class="text-white/80 mb-0 text-sm mt-2 block">
        Displaying in your timezone: {userTimeZone || "Loading..."}
      </p>
    </header>
    {#if loading}
      <p class="text-white m-0">Loading schedule...</p>
    {:else if Object.keys(scheduleByDay).length > 0}
      {#each Object.entries(scheduleByDay) as [day, shows]}
        <div class="mb-16 last:mb-0">
          <h4 class="pb-2 underline">
            {day}
          </h4>
          <ul class="list-none p-0">
            {#each shows as show}
              <li class="flex gap-4 my-2">
                <div class="flex-shrink-0 font-light">
                  {#if show.start}
                    {formatInUserTimeZone(
                      show.start,
                      userTimeZone,
                      "h:mm a"
                    )}
                  {:else}
                    --:--
                  {/if}
                </div>
                <div class="flex-1">
                  {show.playlist?.title ||
                    show.playlist?.name ||
                    "Untitled Show"}
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    {:else}
      <p class="text-white m-0">
        No scheduled shows available at the moment.
      </p>
    {/if}
  </div>
</div>
