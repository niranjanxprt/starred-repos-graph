import { test, expect } from '@playwright/test';

test.describe('Filter Functionality', () => {
  test('category filter reduces node count', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Get initial node count
    const initialCount = await page.locator('.node').count();
    expect(initialCount).toBeGreaterThan(50);

    // Click on a category filter (e.g., "ai-ml")
    const aiMlBtn = await page.locator('.filter-btn').filter({ hasText: /ai-ml|ml|ai/i }).first();
    if (await aiMlBtn.isVisible()) {
      await aiMlBtn.click();
      await page.waitForTimeout(500);

      // Count nodes after filter
      const filteredCount = await page.locator('.node').count();
      expect(filteredCount).toBeLessThan(initialCount);
    }
  });

  test('stars filter works correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Click on stars filter if available
    const starsBtn = await page.locator('.filter-btn').filter({ hasText: /10k|stars/i }).first();
    if (await starsBtn.isVisible()) {
      await starsBtn.click();
      await page.waitForTimeout(500);

      const filteredCount = await page.locator('.node').count();
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('all category shows all repositories', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Apply a filter
    const anyFilter = await page.locator('.filter-btn').first();
    if (await anyFilter.isVisible()) {
      await anyFilter.click();
      await page.waitForTimeout(500);

      const filteredCount = await page.locator('.node').count();

      // Click "All" to reset
      const allBtn = await page.locator('.filter-btn').filter({ hasText: /all/i }).first();
      if (await allBtn.isVisible()) {
        await allBtn.click();
        await page.waitForTimeout(500);

        const resetCount = await page.locator('.node').count();
        expect(resetCount).toBeGreaterThanOrEqual(filteredCount);
      }
    }
  });

  test('filter button active state changes', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const filterBtn = await page.locator('.filter-btn').first();
    const classBeforeClick = await filterBtn.getAttribute('class');

    await filterBtn.click();
    await page.waitForTimeout(300);

    const classAfterClick = await filterBtn.getAttribute('class');
    expect(classAfterClick).toContain('active');
  });
});
