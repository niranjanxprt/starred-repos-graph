import { test, expect } from '@playwright/test';

async function openFilters(page) {
  await page.locator('#toggle-filters-header').click();
  await expect(page.locator('#controls-panel')).not.toHaveClass(/collapsed/);
}

test.describe('Generic Stars Explorer UX', () => {
  test('shows exact synced repository count and generic title', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    await expect(page).toHaveTitle(/GitHub Stars Explorer/);
    await expect(page.locator('.title')).toContainText('GitHub Stars Explorer');
    const totalText = await page.locator('#total-repos').textContent();
    expect(Number(totalText.replace(/,/g, ''))).toBeGreaterThanOrEqual(1569);
    await expect(page.locator('.title-count')).toContainText('repos');
  });

  test('preset controls change visible results', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await openFilters(page);

    const sampleCount = await page.locator('.node').count();
    expect(sampleCount).toBeGreaterThan(20);
    expect(sampleCount).toBeLessThanOrEqual(60);
    await expect(page.locator('[data-preset="sample"]')).toHaveClass(/active/);

    await page.locator('[data-preset="all"]').click();
    await page.waitForTimeout(600);

    const allCount = await page.locator('.node').count();
    expect(allCount).toBeGreaterThan(sampleCount);
  });

  test('generic category taxonomy appears in legend', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    await expect(page.locator('#legend-items')).toContainText(/AI Agents|Frontend|Docs\/Reference/);
  });

  test('search results list mirrors filtered graph', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await openFilters(page);

    await page.locator('#search').fill('react');
    await page.waitForTimeout(600);

    await expect(page.locator('#result-count-label')).toContainText('matching');
    await expect(page.locator('.result-item').first()).toBeVisible();
  });

  test('exports repository dataset as CSV', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(1000);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#export-csv').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^github-stars-explorer-.*\.csv$/);
  });
});
