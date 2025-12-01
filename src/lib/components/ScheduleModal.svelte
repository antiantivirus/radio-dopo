<script>
  import { onMount } from "svelte";
  import { createDialog } from "@melt-ui/svelte";
  import { fly } from "svelte/transition";
  import { formatInUserTimeZone, getUserTimeZone } from "$lib/utils/dates.js";
  import { currentLanguage } from "$lib/stores/language.js";
  import { t } from "$lib/translations.js";

  const {
    elements: { trigger, overlay, content, title, close, portalled },
    states: { open },
  } = createDialog();

  let schedule = $state([]);
  let scheduleByDay = $state({});
  let loading = $state(true);
  let userTimeZone = $state("");
  let lastFetchTime = $state(0);

  const SCHEDULE_API = "/api/schedule";
  const FETCH_COOLDOWN = 60000; // 1 minute in milliseconds

  function groupByDay(shows, lang) {
    const grouped = {};
    shows.forEach((show) => {
      if (!show.start) return;

      const format = lang === 'it' ? "EEEE d MMMM" : "EEEE, d MMMM";
      let dayKey = formatInUserTimeZone(
        show.start,
        userTimeZone,
        format,
        lang
      );

      // Capitalize first letter for Italian
      if (lang === 'it') {
        dayKey = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
      }

      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(show);
    });
    return grouped;
  }

  async function fetchSchedule() {
    const now = Date.now();

    // Skip fetch if we fetched within the last minute
    if (now - lastFetchTime < FETCH_COOLDOWN) {
      return;
    }

    loading = true;
    try {
      const response = await fetch(SCHEDULE_API);
      const result = await response.json();

      if (result.data && Array.isArray(result.data)) {
        schedule = result.data;
        scheduleByDay = groupByDay(result.data, $currentLanguage);
      } else if (Array.isArray(result)) {
        schedule = result;
        scheduleByDay = groupByDay(result, $currentLanguage);
      }
      lastFetchTime = now;
      loading = false;
    } catch (error) {
      loading = false;
    }
  }

  export function openModal() {
    open.set(true);
    fetchSchedule(); // Fetch when opening (respects cooldown)
  }

  export function closeModal() {
    open.set(false);
  }

  // Re-group when language changes
  $effect(() => {
    if (schedule.length > 0) {
      scheduleByDay = groupByDay(schedule, $currentLanguage);
    }
  });

  onMount(() => {
    userTimeZone = getUserTimeZone();
    fetchSchedule();
  });
</script>

<div use:portalled>
  {#if $open}
    <div
      use:overlay
      class="fixed inset-0 bg-black/80 z-[10000]"
      transition:fly={{ duration: 500, x: 0, opacity: 0 }}
    />
    <div
      class="fixed right-0 top-0 bottom-0 bg-orange border-l border-white w-full max-w-[800px] max-md:max-w-full max-md:border-l-0 p-6 px-8 overflow-y-auto z-[10001]"
      use:content
      transition:fly={{ duration: 500, x: 400 }}
    >
      <button
        class="absolute top-6 right-6 bg-transparent no-underline border-none text-white text-3xl cursor-pointer p-2 leading-none transition-transform duration-200 hover:scale-110"
        use:close>✕</button
      >
      <div class="text-white m-0 leading-normal">
        <h2 use:title class="mt-0 mb-2 font-light tracking-[0.2rem]">
          {t("weekly_schedule", $currentLanguage)}
        </h2>
        <p class="text-white/80 mb-12 text-sm mt-0 block">
          Displaying in your timezone: {userTimeZone || "Loading..."}
        </p>
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
                          "h:mm a",
                          $currentLanguage
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
  {/if}
</div>
