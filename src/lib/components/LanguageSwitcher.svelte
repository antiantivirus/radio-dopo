<script>
  import { currentLanguage } from "$lib/stores/language.js";
  import { t } from "$lib/translations.js";

  const languages = [
    { code: "it", label: "IT" },
    { code: "en", label: "EN" },
  ];

  /**
   * @param {string} langCode
   */
  function switchLanguage(langCode) {
    currentLanguage.set(/** @type {'en' | 'it'} */ (langCode));
  }
</script>

<div class="flex items-center gap-2">
  {#each languages as lang}
    <button
      class="font-semibold uppercase tracking-wider {$currentLanguage ===
      lang.code
        ? 'text-white'
        : 'text-white/50 no-underline'}"
      onclick={() => switchLanguage(lang.code)}
    >
      {lang.label}
    </button>
  {/each}
</div>
