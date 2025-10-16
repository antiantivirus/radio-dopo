<script>
  import { onMount } from "svelte";

  let audio = $state();
  let isPlaying = $state(false);
  let currentShow = $state(null);
  let isOnAir = $state(false);
  let loading = $state(true);

  let { onStatusUpdate } = $props();

  const STREAM_URL = "https://streaming.radio.co/s3699c5e49/listen";
  const STATUS_API = "https://public.radio.co/stations/s3699c5e49/status";

  async function fetchStatus() {
    try {
      const response = await fetch(STATUS_API);
      const data = await response.json();
      currentShow = data.current_track || null;
      isOnAir = data.status === "online";
      loading = false;
      onStatusUpdate?.(isOnAir);
    } catch (error) {
      console.error("Error fetching status:", error);
      loading = false;
      onStatusUpdate?.(false);
    }
  }

  export function togglePlay() {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().catch((err) => console.error("Playback error:", err));
      isPlaying = true;
    }
  }

  onMount(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  });
</script>

<audio bind:this={audio} src={STREAM_URL} preload="none"></audio>

<header
  class="flex items-center px-3 gap-8 border-b border-white bg-black h-20"
>
  <button
    class="bg-transparent border-none text-white cursor-pointer p-2 flex items-center justify-center transition-transform duration-200 hover:scale-110"
    onclick={togglePlay}
    aria-label={isPlaying ? "Pause" : "Play"}
  >
    {#if isPlaying}
      <img src="/images/pause.svg" alt="Pause" class="w-10 h-10" />
    {:else}
      <img src="/images/play.svg" alt="Play" class="w-10 h-10" />
    {/if}
  </button>

  <div class="flex-1 min-w-0 show-title">
    {#if loading}
      <p class="truncate">Loading...</p>
    {:else if currentShow}
      <p class="truncate">
        {currentShow.title || "Live Now"}
      </p>
    {:else}
      <p class="truncate">Live Radio</p>
    {/if}
  </div>

  <div class="flex items-center gap-4 pr-3 on-air-desktop">
    <img
      src="/images/onAir.svg"
      alt="On Air"
      class="on-air-icon"
      class:active={isOnAir}
    />
  </div>
</header>

<style>
  .on-air-icon {
    width: 30px;
    height: 30px;
    filter: grayscale(100%) brightness(0.5);
    transition: filter 0.3s;
  }

  .on-air-icon.active {
    filter: none;
  }

  @media (max-width: 768px) {
    .show-title p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .on-air-desktop {
      display: none;
    }
  }
</style>
