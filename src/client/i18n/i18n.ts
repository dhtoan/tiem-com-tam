import { VI_TRANSLATIONS, type TranslationKey } from './vi';
import { EN_TRANSLATIONS } from './en';

export type Locale = 'vi' | 'en';

let currentLocale: Locale = 'vi';
const listeners = new Set<(locale: Locale) => void>();

const STORAGE_KEY = 'tiem_com_tam_locale';

// Initialize from localStorage if running in browser
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === 'vi' || saved === 'en') {
      currentLocale = saved;
    }
  } catch {
    // Ignore localStorage access errors
  }
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  if (locale !== 'vi' && locale !== 'en') {
    return;
  }
  if (currentLocale !== locale) {
    currentLocale = locale;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, locale);
      } catch {
        // Ignore localStorage error
      }
    }
    listeners.forEach((listener) => {
      try {
        listener(currentLocale);
      } catch (err) {
        console.error('Error in i18n locale listener:', err);
      }
    });
  }
}

export function onLocaleChange(callback: (locale: Locale) => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const dictionary = currentLocale === 'en' ? EN_TRANSLATIONS : VI_TRANSLATIONS;
  let text = dictionary[key];

  // Fallback to Vietnamese if English key is somehow missing
  if (text === undefined && currentLocale !== 'vi') {
    text = VI_TRANSLATIONS[key];
  }

  // Fallback to raw key if key not in dictionary
  if (text === undefined) {
    text = key;
  }

  if (params) {
    for (const [paramKey, paramVal] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }
  }

  return text;
}
