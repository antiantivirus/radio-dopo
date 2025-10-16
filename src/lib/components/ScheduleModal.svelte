<script>
  import { onMount } from "svelte";
  import { createDialog } from "@melt-ui/svelte";
  import { fly } from "svelte/transition";

  const {
    elements: { trigger, overlay, content, title, close, portalled },
    states: { open },
  } = createDialog();

  let schedule = $state([]);
  let scheduleByDay = $state({});
  let loading = $state(true);

  const SCHEDULE_API =
    "https://public.radio.co/stations/s3699c5e49/embed/schedule";

  function groupByDay(shows) {
    const grouped = {};
    shows.forEach((show) => {
      if (!show.start) return;

      const date = new Date(show.start);
      const dayKey = date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(show);
    });
    return grouped;
  }

  async function fetchSchedule() {
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
      console.error("Error fetching schedule:", error);
      loading = false;
    }
  }

  export function openModal() {
    open.set(true);
    fetchSchedule();
  }

  export function closeModal() {
    open.set(false);
  }

  onMount(() => {
    fetchSchedule();
  });
</script>

<div use:portalled>
  {#if $open}
    <div
      use:overlay
      class="fixed inset-0 bg-black/80 z-[1000]"
      transition:fly={{ duration: 300, x: 0, opacity: 0 }}
    />
    <div
      class="modal-content"
      use:content
      transition:fly={{ duration: 300, x: 400 }}
    >
      <button class="close-button" use:close>✕</button>
      <div class="schedule-content">
        <h2 use:title class="mt-0 mb-12 font-light tracking-[0.2rem]">
          WEEKLY SCHEDULE (CET)
        </h2>
        {#if loading}
          <p class="">Loading schedule...</p>
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
                        {new Date(show.start).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
          <p class="text-white">No scheduled shows available at the moment.</p>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .modal-content {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    background: var(--color-orange);
    border-left: 1px solid white;
    width: 100%;
    max-width: 800px;
    padding: 3rem 2rem;
    overflow-y: auto;
    z-index: 1001;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
    line-height: 1;
    transition: transform 0.2s;
  }

  .close-button:hover {
    transform: scale(1.1);
  }

  .schedule-content p {
    color: white;
    margin: 0;
    line-height: 1.4;
  }

  .time-range {
    margin-top: 0.5rem;
    color: white;
  }

  @media (max-width: 768px) {
    .modal-content {
      max-width: 100%;
      border-left: none;
    }
  }
</style>
