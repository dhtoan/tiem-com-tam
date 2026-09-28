import { test, expect } from '@playwright/test';

test.describe('Vietnamese and English Localization E2E', () => {
  test('defaults to Vietnamese and allows live runtime switching to English with persistence', async ({ page }) => {
    await page.goto('/');

    // 1. Check default locale is Vietnamese
    const defaultLocale = await page.evaluate(() => {
      const i18n = (window as unknown as { __i18n: { getLocale: () => string; t: (k: string) => string } }).__i18n;
      return {
        locale: i18n.getLocale(),
        title: i18n.t('ui.game_title'),
        endingTitle: i18n.t('ending.perfect.title'),
      };
    });

    expect(defaultLocale.locale).toBe('vi');
    expect(defaultLocale.title).toBe('Tiệm Cơm Tấm Sài Gòn');
    expect(defaultLocale.endingTitle).toBe('Bà Chủ Cơm Tấm Sài Gòn');

    // 2. Switch to English runtime
    const enLocale = await page.evaluate(() => {
      const i18n = (window as unknown as { __i18n: { setLocale: (l: string) => void; getLocale: () => string; t: (k: string) => string } }).__i18n;
      i18n.setLocale('en');
      return {
        locale: i18n.getLocale(),
        title: i18n.t('ui.game_title'),
        endingTitle: i18n.t('ending.perfect.title'),
      };
    });

    expect(enLocale.locale).toBe('en');
    expect(enLocale.title).toBe('Saigon Broken Rice Stall');
    expect(enLocale.endingTitle).toBe('Queen of Saigon Broken Rice');

    // 3. Verify persistence across page reload
    await page.reload();

    const persistedLocale = await page.evaluate(() => {
      const i18n = (window as unknown as { __i18n: { getLocale: () => string; t: (k: string) => string } }).__i18n;
      return {
        locale: i18n.getLocale(),
        title: i18n.t('ui.game_title'),
      };
    });

    expect(persistedLocale.locale).toBe('en');
    expect(persistedLocale.title).toBe('Saigon Broken Rice Stall');
  });
});
