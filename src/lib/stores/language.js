import { writable } from 'svelte/store';

// Map UI language codes to Directus locale codes
const localeMap = {
  'en': 'en-US',
  'it': 'it-IT'
};

// Detect browser language and map to our supported languages
const detectBrowserLanguage = () => {
  if (typeof window === 'undefined') return 'it'; // Default to Italian on server

  const browserLang = navigator.language;

  // Map browser language codes to our supported languages
  if (browserLang.startsWith('it')) {
    return 'it';
  }
  if (browserLang.startsWith('en')) {
    return 'en';
  }
  // Default to Italian for all other languages
  return 'it';
};

// Get initial language from localStorage, browser preference, or default to 'it'
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    // First check localStorage for saved preference
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      return savedLang;
    }
    // If no saved preference, use browser language
    return detectBrowserLanguage();
  }
  return 'it'; // Default to Italian on server
};

// Create the language store
export const currentLanguage = writable(getInitialLanguage());

// Subscribe to changes and save to localStorage
if (typeof window !== 'undefined') {
  currentLanguage.subscribe(value => {
    localStorage.setItem('language', value);
  });
}

// Helper to get Directus locale code from UI language code
export function getDirectusLocale(lang) {
  return localeMap[lang] || 'en-US';
}

// Helper to get translation from translations array
// Now works with all translations loaded from server
export function getTranslation(translations, lang, field = 'description') {
  if (!translations || !Array.isArray(translations)) return '';

  const directusLocale = getDirectusLocale(lang);

  // Find the translation for the requested language
  const translation = translations.find(t => t.languages_code === directusLocale);

  // If translation found, return it
  if (translation?.[field]) {
    return translation[field];
  }

  // Fall back to Italian (it-IT) as default
  const italianTranslation = translations.find(t => t.languages_code === 'it-IT');
  if (italianTranslation?.[field]) {
    return italianTranslation[field];
  }

  // Last resort: return first available translation
  return translations[0]?.[field] || '';
}

// Helper for singleton translations (about, partners)
// These have a different structure where translations might be nested differently
export function getSingletonTranslation(data, lang, field = 'content') {
  if (!data) return '';

  // Check if translations exist and are structured as expected
  if (data.translations) {
    // If translations is an array (like collections)
    if (Array.isArray(data.translations)) {
      return getTranslation(data.translations, lang, field);
    }
    // If translations is an object with direct access
    if (typeof data.translations === 'object' && data.translations[field]) {
      return data.translations[field];
    }
  }

  // Fallback to direct field
  return data[field] || '';
}