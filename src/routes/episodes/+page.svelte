<script>
  import BackgroundPattern from "$lib/components/BackgroundPattern.svelte";
  import EpisodeRow from "$lib/components/EpisodeRow.svelte";
  import { currentLanguage } from "$lib/stores/language.js";
  import { t } from "$lib/translations.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  // Get data from server-side load function
  let { data } = $props();

  let searchQuery = $state($page.url.searchParams.get("search") || "");
  let isLoading = $state(false);
  let allEpisodes = $state(data.episodes);
  let hasMore = $state(data.hasMore);

  // Handle search
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let searchTimeout;
  function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.set("search", searchQuery);
      }
      await goto(`/episodes?${params.toString()}`, { keepFocus: true });
    }, 500);
  }

  // Load more episodes
  async function loadMore() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    try {
      const params = new URLSearchParams($page.url.searchParams);
      params.set("offset", allEpisodes.length.toString());
      params.set("limit", "20");

      const response = await fetch(`/api/episodes?${params.toString()}`);
      const newData = await response.json();

      allEpisodes = [...allEpisodes, ...newData.episodes];
      hasMore = newData.hasMore;
    } finally {
      isLoading = false;
    }
  }

  // Watch for data changes
  $effect(() => {
    allEpisodes = data.episodes;
    hasMore = data.hasMore;
  });
</script>

<BackgroundPattern />

<div class="min-h-screen p-4 md:p-6">
  <header class="text-left mb-12">
    <h1 class="font-normal m-0 text-white uppercase tracking-[0.1em]">
      {t("archive", $currentLanguage)}
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

  <div class="flex flex-col gap-8 mt-8 max-md:px-4">
    {#if allEpisodes.length === 0}
      <div class="text-center py-16 px-8">
        <p class="text-white/60 mb-6">
          {searchQuery
            ? `No episodes found matching "${searchQuery}"`
            : "No episodes available"}
        </p>
        {#if searchQuery}
          <button onclick={() => (searchQuery = "")}> Clear search </button>
        {/if}
      </div>
    {:else}
      {#each allEpisodes as episode (episode.id)}
        <EpisodeRow {episode} showDate={false} />
      {/each}
      {#if hasMore}
        <div class="flex justify-center mt-8">
          <button onclick={loadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      {/if}
    {/if}
  </div>
</div>
