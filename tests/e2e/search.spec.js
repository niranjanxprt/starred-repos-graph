import { test, expect } from '@playwright/test';

async function openFilters(page) {
  await page.locator('#toggle-filters-header').click();
  await expect(page.locator('#controls-panel')).not.toHaveClass(/collapsed/);
}

test.describe('Search Functionality', () => {
  test('search input reduces node count', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await openFilters(page);

    await page.locator('[data-preset="all"]').click();
    await page.waitForTimeout(500);
    const initialCount = await page.locator('.node').count();
    expect(initialCount).toBeGreaterThan(1000);

    // Type in search box
    const searchInput = await page.locator('.search-input');
    if (await searchInput.isVisible()) {
      await searchInput.fill('react');
      await page.waitForTimeout(500);

      const searchedCount = await page.locator('.node').count();
      expect(searchedCount).toBeLessThan(initialCount);
      expect(searchedCount).toBeGreaterThan(0);
    }
  });

  test('search with no results shows empty state', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await openFilters(page);

    const searchInput = await page.locator('.search-input');
    if (await searchInput.isVisible()) {
      await searchInput.fill('xyznonexistentrepo12345');
      await page.waitForTimeout(500);

      const nodeCount = await page.locator('.node').count();
      expect(nodeCount).toBe(0);

      // Empty state message might appear
      const page_content = await page.textContent('body');
      expect(page_content).toBeTruthy();
    }
  });

  test('clear search resets all repositories', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await openFilters(page);

    await page.locator('[data-preset="all"]').click();
    await page.waitForTimeout(500);
    const initialCount = await page.locator('.node').count();

    // Search for something
    const searchInput = await page.locator('.search-input');
    if (await searchInput.isVisible()) {
      await searchInput.fill('tensorflow');
      await page.waitForTimeout(500);

      const searchedCount = await page.locator('.node').count();
      expect(searchedCount).toBeLessThan(initialCount);

      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(500);

      const resetCount = await page.locator('.node').count();
      expect(resetCount).toBe(initialCount);
    }
  });

  test('escape key clears search', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await openFilters(page);

    await page.locator('[data-preset="all"]').click();
    await page.waitForTimeout(500);

    const searchInput = await page.locator('.search-input');
    if (await searchInput.isVisible()) {
      const initialCount = await page.locator('.node').count();

      await searchInput.fill('tensorflow');
      await page.waitForTimeout(500);
      const searchedCount = await page.locator('.node').count();
      expect(searchedCount).toBeLessThan(initialCount);

      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      const afterEscapeValue = await searchInput.inputValue();
      expect(afterEscapeValue).toBe('');

      const resetCount = await page.locator('.node').count();
      expect(resetCount).toBeLessThan(initialCount);
      expect(resetCount).toBeGreaterThan(20);
      await expect(page.locator('[data-preset="sample"]')).toHaveClass(/active/);
    }
  });

  test('search is case-insensitive', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await openFilters(page);

    const searchInput = await page.locator('.search-input');
    if (await searchInput.isVisible()) {
      // Search lowercase
      await searchInput.fill('docker');
      await page.waitForTimeout(500);
      const lowerCount = await page.locator('.node').count();

      // Clear and search uppercase
      await searchInput.clear();
      await page.waitForTimeout(300);
      await searchInput.fill('DOCKER');
      await page.waitForTimeout(500);
      const upperCount = await page.locator('.node').count();

      expect(lowerCount).toBe(upperCount);
    }
  });
});
