import { describe, it, expect, beforeEach } from 'vitest';
import { t, getLocale, setLocale, onLocaleChange, type Locale } from '../../src/client/i18n/i18n';
import { VI_TRANSLATIONS } from '../../src/client/i18n/vi';
import { EN_TRANSLATIONS } from '../../src/client/i18n/en';

describe('i18n Localization System', () => {
  beforeEach(() => {
    setLocale('vi');
  });

  it('defaults to Vietnamese locale', () => {
    expect(getLocale()).toBe('vi');
  });

  it('translates basic keys in Vietnamese and switches to English', () => {
    expect(t('ui.game_title')).toBe('Tiệm Cơm Tấm Sài Gòn');

    setLocale('en');
    expect(getLocale()).toBe('en');
    expect(t('ui.game_title')).toBe('Saigon Broken Rice Stall');
  });

  it('performs parameter interpolation properly in both languages', () => {
    expect(t('ui.day_counter', { day: 12 })).toBe('Ngày 12');

    setLocale('en');
    expect(t('ui.day_counter', { day: 12 })).toBe('Day 12');
  });

  it('notifies listeners when locale changes', () => {
    let notifiedLocale: Locale | null = null;
    const unsubscribe = onLocaleChange((locale) => {
      notifiedLocale = locale;
    });

    setLocale('en');
    expect(notifiedLocale).toBe('en');

    setLocale('vi');
    expect(notifiedLocale).toBe('vi');

    unsubscribe();
  });

  it('maintains 100% key parity between Vietnamese and English dictionaries', () => {
    const viKeys = Object.keys(VI_TRANSLATIONS).sort();
    const enKeys = Object.keys(EN_TRANSLATIONS).sort();

    const missingInEn = viKeys.filter((key) => !(key in EN_TRANSLATIONS));
    const missingInVi = enKeys.filter((key) => !(key in VI_TRANSLATIONS));

    expect(missingInEn).toEqual([]);
    expect(missingInVi).toEqual([]);
    expect(viKeys.length).toBe(enKeys.length);
    expect(viKeys.length).toBeGreaterThanOrEqual(50);
  });

  it('has non-empty values for all translations in both languages', () => {
    for (const [key, value] of Object.entries(VI_TRANSLATIONS)) {
      expect(value, `Empty VI value for key: ${key}`).toBeTruthy();
      expect(typeof value).toBe('string');
    }

    for (const [key, value] of Object.entries(EN_TRANSLATIONS)) {
      expect(value, `Empty EN value for key: ${key}`).toBeTruthy();
      expect(typeof value).toBe('string');
    }
  });

  it('covers all 6 canonical endings in both languages', () => {
    const endingIds = ['perfect', 'family', 'jd', 'neighborhood', 'husband_finance', 'comeback'];
    for (const ending of endingIds) {
      expect(VI_TRANSLATIONS[`ending.${ending}.title` as keyof typeof VI_TRANSLATIONS]).toBeTruthy();
      expect(VI_TRANSLATIONS[`ending.${ending}.description` as keyof typeof VI_TRANSLATIONS]).toBeTruthy();
      expect(EN_TRANSLATIONS[`ending.${ending}.title` as keyof typeof EN_TRANSLATIONS]).toBeTruthy();
      expect(EN_TRANSLATIONS[`ending.${ending}.description` as keyof typeof EN_TRANSLATIONS]).toBeTruthy();
    }
  });
});
