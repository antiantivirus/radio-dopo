<script>
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import AudioPlayer from "$lib/components/AudioPlayer.svelte";
  import ScheduleModal from "$lib/components/ScheduleModal.svelte";
  import BackgroundPattern from "$lib/components/BackgroundPattern.svelte";

  let { children } = $props();

  let scheduleModal = $state();
  let isOnAir = $state(false);

  function openSchedule() {
    scheduleModal?.openModal();
  }

  function handleStatusUpdate(onAirStatus) {
    isOnAir = onAirStatus;
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<head>
  <title>Radio Dopo</title>
</head>
<div
  class="min-h-screen w-full bg-black pt-20 md:pt-20 overflow-x-hidden mobile-padding"
>
  <div class="fixed top-0 left-0 right-0 z-[100] bg-black">
    <div
      class="mobile-top-bar md:hidden flex items-center justify-between px-4 h-16 border-b border-white gap-3"
    >
      <div class="w-6"></div>
      <img src="/images/logo.svg" alt="Radio Dopo" class="h-10" />
      <img
        src="/images/onAir.svg"
        alt="On Air"
        class="on-air-mobile w-6 h-6 cursor-pointer"
        class:active={isOnAir}
        onclick={openSchedule}
      />
    </div>
    <AudioPlayer onStatusUpdate={handleStatusUpdate} />
  </div>

  <div
    class="grid grid-cols-[80px_1fr_80px] min-h-[calc(100vh-80px)] md:grid-cols-[60px_1fr_60px] max-md:grid-cols-1"
  >
    <aside class="sidebar sidebar-left"></aside>

    <main class="main-content">
      {@render children?.()}
    </main>

    <aside class="sidebar sidebar-right" onclick={openSchedule}>
      <p class="sidebar-text text-large">SCHEDULE</p>
    </aside>
  </div>
</div>

<BackgroundPattern />
<ScheduleModal bind:this={scheduleModal} />

<style>
  @font-face {
    font-family: "Neue Vektor";
    src:
      url("/fonts/NeueVektorCNCRegular.woff2") format("woff2"),
      url("/fonts/NeueVektorCNCRegular.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    background: #000;
    color: #fff;
    font-family:
      "Neue Vektor",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      "Helvetica Neue",
      Arial,
      sans-serif;
    overflow-x: hidden;
  }

  .sidebar {
    background: #000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    position: fixed;
    top: 80px;
    bottom: 0;
    width: 80px;
    padding-top: 2rem;
  }

  .sidebar-left {
    left: 0;
    border-right: 1px solid white;
  }

  .sidebar-right {
    right: 0;
    border-left: 1px solid white;
    cursor: pointer;
    transition: background 0.3s;
  }

  .sidebar-right:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .sidebar-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }

  @media (max-width: 768px) {
    .sidebar {
      display: none;
    }
  }

  .main-content {
    background: radial-gradient(
        circle at 20% 30%,
        rgba(0, 100, 150, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba(0, 100, 150, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 50% 50%,
        rgba(0, 100, 150, 0.03) 0%,
        transparent 70%
      );
    grid-column: 2;
  }

  .mobile-top-bar {
    background: #000;
  }

  .on-air-mobile {
    filter: grayscale(100%) brightness(0.5);
    transition: filter 0.3s;
  }

  .on-air-mobile.active {
    filter: none;
  }

  @media (max-width: 768px) {
    .mobile-padding {
      padding-top: 144px !important;
    }
  }
</style>
