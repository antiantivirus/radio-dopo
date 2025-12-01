<script>
  import BackgroundPattern from "$lib/components/BackgroundPattern.svelte";
  import Markdown from "$lib/components/Markdown.svelte";
  import { currentLanguage, getTranslation } from "$lib/stores/language.js";
  import { t } from "$lib/translations.js";

  // Get data from server-side load function
  let { data } = $props();

  const lang = $derived($currentLanguage);

  // Helper to get translated content - works with array of translations
  const content = $derived(
    getTranslation(data.partners.translations, lang, "content")
  );
</script>

<BackgroundPattern />

<div class="min-h-screen p-4 md:p-6">
  <h1 class="font-normal mb-12 text-white uppercase tracking-[0.1em] text-left">
    {t("page_partners", lang)}
  </h1>

  {#if content}
    <Markdown {content} class="text-white max-w-[65ch]" />
  {/if}
</div>
