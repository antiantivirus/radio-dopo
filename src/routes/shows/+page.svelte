<script>
  import BackgroundPattern from "$lib/components/BackgroundPattern.svelte";
  import DirectusImage from "$lib/components/DirectusImage.svelte";
  import Markdown from "$lib/components/Markdown.svelte";
  import { currentLanguage, getTranslation } from "$lib/stores/language.js";
  import { t } from "$lib/translations.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  /**
   * @typedef {import('$lib/types.js').Show} Show
   */

  // Get data from server-side load function
  /** @type {{ data: { shows: Show[], hasMore: boolean } }} */
  let { data } = $props();

  let searchQuery = $state($page.url.searchParams.get("search") || "");
  let isLoading = $state(false);
  let allShows = $state(data.shows);
  let hasMore = $state(data.hasMore);

  const lang = $derived($currentLanguage);

  // Helper to get translated description - now reactive to lang changes
  /**
   * @param {Show} show
   * @param {string} language
   */
  function getDescription(show, language) {
    return getTranslation(show.translations, language, "description");
  }

  // Handle search
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let searchTimeout;
  function handleSearch() {
    clearTimeout(searchTimeout);
    isLoading = true;
    searchTimeout = setTimeout(async () => {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.set("search", searchQuery);
      }
      await goto(`/shows?${params.toString()}`, { keepFocus: true });
      isLoading = false;
    }, 500);
  }

  // Load more shows
  async function loadMore() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    try {
      const params = new URLSearchParams($page.url.searchParams);
      params.set("offset", allShows.length.toString());
      params.set("limit", "20");

      const response = await fetch(`/api/shows?${params.toString()}`);
      const newData = await response.json();

      allShows = [...allShows, ...newData.shows];
      hasMore = newData.hasMore;
    } finally {
      isLoading = false;
    }
  }

  // Watch for data changes
  $effect(() => {
    allShows = data.shows;
    hasMore = data.hasMore;
    isLoading = false;
  });
</script>

<BackgroundPattern />

<div class="min-h-screen py-6">
  <div class="px-3 md:px-6">
    <header class="text-left mb-12">
      <h1 class="font-normal m-0 text-white uppercase tracking-[0.1em]">
        {t("page_shows", lang)}
      </h1>
    </header>

    <div class="mb-12">
      <input
        type="text"
        bind:value={searchQuery}
        oninput={handleSearch}
        placeholder="Search"
        class="w-full md:max-w-3/12 pb-0"
      />
    </div>
  </div>

  <div class="flex flex-col border-t border-white">
    {#if isLoading}
      <div class="flex justify-center items-center py-16">
        <img
          src="/images/onAir.svg"
          alt="Loading"
          class="w-8 h-8 animate-pulse brightness-0 invert"
        />
      </div>
    {:else if allShows.length === 0}
      <div class="text-center py-16 px-8">
        <p class="text-white/60 mb-6">
          {searchQuery
            ? `No shows found matching "${searchQuery}"`
            : "No shows available"}
        </p>
        {#if searchQuery}
          <button onclick={() => (searchQuery = "")}> Clear search </button>
        {/if}
      </div>
    {:else}
      {#each allShows as show (show.id)}
        {@const description = getDescription(show, lang)}
        <a
          href="/shows/{show.slug}"
          class="grid grid-cols-[3fr_4fr_4fr] gap-8 items-start border-b border-white no-underline text-white transition-opacity hover:opacity-80 md:px-6 py-3 md:py-0 max-md:grid-cols-1 max-md:gap-4"
        >
          <div
            class="flex flex-col gap-2 justify-between h-full p-3 pb-0 md:p-6 md:px-0"
          >
            <h2 class="font-normal m-0 text-white underline">
              {show.name}
            </h2>
            {#if show.frequency}
              <div class="flex gap-2 items-start">
                <span class="mt-1.5">→</span>
                <p class="font-normal m-0 whitespace-pre-line">
                  {show.frequency.replace(/\s*\/\s*/g, "\n")}
                </p>
              </div>
            {/if}
          </div>
          {#if show.image}
            <DirectusImage
              src={show.image}
              alt={show.name}
              width="full"
              height="auto"
              class="w-full h-full block"
            />
          {/if}
          {#if description}
            <div class="p-3 pt-0 md:p-6 md:px-0 description-clamp">
              <Markdown content={description} />
            </div>
          {/if}
        </a>
      {/each}
      {#if hasMore}
        <div class="flex justify-center mt-8 px-4 md:px-8">
          <button onclick={loadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .description-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .description-clamp :global(*) {
    margin: 0;
  }
</style>
