<script>
  import { onMount } from "svelte";

  let imagePosition = $state({ x: 50, y: 50 });
  let showImage = $state(false);
  let randomImageNumber = $state(1);

  onMount(() => {
    randomImageNumber = Math.floor(Math.random() * 6) + 1;

    imagePosition = {
      x: Math.random() * 100,
      y: 30 + Math.random() * 45,
    };
    setTimeout(() => {
      showImage = true;
    }, 50);
  });
</script>

<div class="page-container">
  <div
    class="hidden md:flex flex-col items-center justify-center relative w-[50vw] max-w-[800px]"
    style="min-height: 70vh;"
  >
    <img
      src="/images/background/{randomImageNumber}.jpeg"
      alt=""
      class="logo-background"
      class:show={showImage}
      style="left: {imagePosition.x}%; top: {imagePosition.y}%;"
    />
    <img
      src="/images/logo.svg"
      alt="Radio Dopo"
      class="w-full max-w-[1600px] h-auto relative z-[1] md:mix-blend-difference"
    />
  </div>

  <div class="md:hidden flex flex-col items-center w-full mobile-hero">
    <img
      src="/images/background/{randomImageNumber}.jpeg"
      alt=""
      class="mobile-background-image"
      class:show={showImage}
    />
    <img
      src="/images/logo.svg"
      alt="Radio Dopo"
      class="mobile-logo w-5/6 h-auto relative z-[1]"
    />
  </div>

  <div
    class="w-full max-w-prose text-center leading-relaxed mobile-text-padding"
  >
    <p class="mb-6 text-white last:mb-0">
      Established in 2024, Radio Dopo is a Palermo-based community radio
      station, working with artists, cultural workers and non-profit
      organizations, borne from a partnership with likeminded community radio
      stations Kiosk Radio in Brussels and Refuge Worldwide in Berlin.
    </p>
    <p class="mb-6 text-white last:mb-0">
      The station pre-launches in June 2025 before beginning transmissions and
      moving into a physical studio in the center of Palermo in 2025 at the
      historical Teatro Garibaldi.
    </p>
  </div>
</div>

<style>
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    min-height: 100%;
    gap: 4rem;
  }

  .logo-background {
    position: absolute;
    width: 50%;
    max-width: 300px;
    height: auto;
    opacity: 0;
    z-index: 0;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: opacity 0.8s ease-in;
  }

  .logo-background.show {
    opacity: 1;
  }

  @media (max-width: 768px) {
    .page-container {
      padding: 0;
      gap: 2rem;
    }

    .mobile-hero {
      padding: 0;
      margin: 0;
    }

    .mobile-background-image {
      width: 100vw;
      max-width: 100vw;
      height: auto;
      opacity: 0;
      transition: opacity 0.8s ease-in;
      margin-bottom: -60px;
      z-index: 0;
    }

    .mobile-background-image.show {
      opacity: 1;
    }

    .mobile-logo {
      margin-top: 0;
      padding: 0 1rem;
    }

    .mobile-text-padding {
      padding: 0 2rem;
    }
  }
</style>
