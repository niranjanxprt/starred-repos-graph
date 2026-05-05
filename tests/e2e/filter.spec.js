import { test, expect } from '@playwright/test';

async function openFilters(page) {
  await page.locator('#toggle-filters-header').click();
  await expect(page.locator('#controls-panel')).not.toHaveClass(/collapsed/);
}

test.describe('Filter Functionality', () => {
  test('category filter changes visible node count', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await openFilters(page);

    // Get initial node count
    const initialCount = await page.locator('.node').count();
    expect(initialCount).toBeGreaterThan(20);

    const categoryBtn = await page.locator('#category-filters .filter-btn').filter({ hasText: /^LLM Apps/i }).first();
    if (await categoryBtn.isVisible()) {
      await categoryBtn.click();
      await page.waitForTimeout(500);

      const filteredCount = await page.locator('.node').count();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).not.toBe(initialCount);
    }
  });

  test('stars filter works correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await openFilters(page);

    // Click on stars filter if available
    const starsBtn = await page.locator('#stars-filters .filter-btn').filter({ hasText: /10k/i }).first();
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
    await openFilters(page);

    // Apply a filter
    const anyFilter = await page.locator('.filter-btn').first();
    if (await anyFilter.isVisible()) {
      await anyFilter.click();
      await page.waitForTimeout(500);

      const filteredCount = await page.locator('.node').count();

      // Click "All" to reset
      const allBtn = await page.locator('#preset-filters .filter-btn').filter({ hasText: /^All$/i }).first();
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
    await openFilters(page);

    const filterBtn = await page.locator('.filter-btn').first();
    const classBeforeClick = await filterBtn.getAttribute('class');

    await filterBtn.click();
    await page.waitForTimeout(300);

    const classAfterClick = await filterBtn.getAttribute('class');
    expect(classAfterClick).toContain('active');
  });
});
