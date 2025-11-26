// Simple translations object
export const translations = {
  en: {
    nav_shows: "Shows",
    nav_episodes: "Episodes",
    nav_about: "About",
    nav_partners: "Partners",
    search_placeholder: "Search shows by title, frequency, or description...",
    search_no_results: "No shows found matching \"{query}\"",
    search_clear: "Clear search",
    episodes_no_available: "No episodes available yet.",
    lang_en: "EN",
    lang_it: "IT",
    menu: "MENU",
    schedule: "SCHEDULE",
    view_archive: "View Archive",
    archive: "ARCHIVE"
  },
  it: {
    nav_shows: "Programmi",
    nav_episodes: "Episodi",
    nav_about: "Chi Siamo",
    nav_partners: "Partner",
    search_placeholder: "Cerca programmi per titolo, frequenza o descrizione...",
    search_no_results: "Nessun programma trovato per \"{query}\"",
    search_clear: "Cancella ricerca",
    episodes_no_available: "Nessun episodio disponibile.",
    lang_en: "EN",
    lang_it: "IT",
    menu: "MENU",
    schedule: "PROGRAMMA",
    view_archive: "Vedi Archivio",
    archive: "ARCHIVIO"
  }
};

// Helper function to get translation
export function t(key, lang = 'en', params = {}) {
  let text = translations[lang]?.[key] || translations.en[key] || key;

  // Replace parameters like {query}
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });

  return text;
}
