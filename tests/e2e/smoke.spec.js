import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/GitHub Stars Explorer/);
  });

  test('SVG graph element exists', async ({ page }) => {
    await page.goto('/');
    const svg = await page.locator('#graph');
    await expect(svg).toBeVisible();
  });

  test('small default sample bubble circles are rendered', async ({ page }) => {
    await page.goto('/');
    // Wait for simulation to settle
    await page.waitForTimeout(2000);
    const circles = await page.locator('.node');
    const count = await circles.count();
    expect(count).toBeGreaterThanOrEqual(30);
    expect(count).toBeLessThanOrEqual(60);
  });

  test('stats display non-zero values', async ({ page }) => {
    await page.goto('/');
    // Check total repos count
    const titleCount = await page.locator('.title-count').textContent();
    expect(titleCount).toBeTruthy();
    expect(parseInt(titleCount)).toBeGreaterThan(0);

    // Check stat numbers exist
    const statNumbers = await page.locator('.stat-number');
    const count = await statNumbers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('header elements are visible', async ({ page }) => {
    await page.goto('/');
    const header = await page.locator('.app-header');
    const title = await page.locator('.title');
    const stats = await page.locator('.stats');

    await expect(header).toBeVisible();
    await expect(title).toBeVisible();
    await expect(stats).toBeVisible();
  });
});
