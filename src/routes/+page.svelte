<script>
  import { onMount } from "svelte";
  import EpisodeRow from "$lib/components/EpisodeRow.svelte";
  import DirectusImage from "$lib/components/DirectusImage.svelte";
  import { currentLanguage } from "$lib/stores/language.js";
  import { t } from "$lib/translations.js";

  let { data } = $props();

  let imagePosition = $state({ x: 50, y: 50 });
  let showImage = $state(false);

  onMount(() => {
    imagePosition = {
      x: Math.random() * 100,
      y: 30 + Math.random() * 45,
    };
    setTimeout(() => {
      showImage = true;
    }, 50);
  });
</script>

<div
  class="flex flex-col items-center justify-center p-8 min-h-full gap-16 max-md:p-0 max-md:gap-8"
>
  <div
    class="hidden md:flex flex-col items-center justify-center relative w-[50vw] max-w-[800px]"
    style="min-height: 70vh;"
  >
    {#if data.randomImage}
      <DirectusImage
        src={data.randomImage}
        alt=""
        width={400}
        height={400}
        class="absolute w-[50%] max-w-[350px] h-auto z-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[800ms] ease-in {showImage
          ? 'opacity-100'
          : 'opacity-0'}"
        style="left: {imagePosition.x}%; top: {imagePosition.y}%;"
      />
    {/if}
    <img
      src="/images/logo.svg"
      alt="Radio Dopo"
      class="w-full max-w-[1600px] h-auto relative z-[1] md:mix-blend-difference"
    />
  </div>

  <div class="md:hidden flex flex-col items-center w-full p-0 m-0">
    {#if data.randomImage}
      <DirectusImage
        src={data.randomImage}
        alt=""
        width={600}
        height={600}
        class="w-screen max-w-full h-auto z-0 transition-opacity duration-[800ms] ease-in -mb-[60px] {showImage
          ? 'opacity-100'
          : 'opacity-0'}"
      />
    {/if}
    <img
      src="/images/logo.svg"
      alt="Radio Dopo"
      class="w-5/6 h-auto relative z-[1] mt-0 px-4"
    />
  </div>

  {#if data.episodes && data.episodes.length > 0}
    <div class="w-full max-w-screen-xl px-0 md:px-8 max-md:px-4">
      <h2
        class="font-normal mb-8 text-white uppercase tracking-[0.1em] text-center"
      >
        Recent Episodes
      </h2>
      <div class="flex flex-col gap-8 max-w-3xl mx-auto">
        {#each data.episodes as episode (episode.id)}
          <EpisodeRow {episode} showDate={false} />
        {/each}
      </div>
      <div class="flex justify-center mt-8">
        <a href="/episodes" class="underline">
          {t("view_archive", $currentLanguage)}
        </a>
      </div>
    </div>
  {/if}
</div>
