import { test, expect } from '@playwright/test';

test.describe('Tooltip Functionality', () => {
  test('hovering over bubble shows tooltip', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const firstNode = await page.locator('.node').first();
    await firstNode.hover();
    await page.waitForTimeout(300);

    const tooltip = await page.locator('#tooltip');
    const isVisible = await tooltip.isVisible();
    expect(isVisible).toBe(true);
  });

  test('tooltip contains repository title', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const firstNode = await page.locator('.node').first();
    await firstNode.hover();
    await page.waitForTimeout(300);

    const tooltipTitle = await page.locator('.tooltip-title');
    const titleText = await tooltipTitle.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText.length).toBeGreaterThan(0);
  });

  test('tooltip shows star count', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const firstNode = await page.locator('.node').first();
    await firstNode.hover();
    await page.waitForTimeout(300);

    const tooltipStats = await page.locator('.tooltip-stat');
    const statsCount = await tooltipStats.count();
    expect(statsCount).toBeGreaterThan(0);

    // First stat is usually stars
    const starsStat = await tooltipStats.first().textContent();
    expect(starsStat).toBeTruthy();
  });

  test('mouseout hides tooltip', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const firstNode = await page.locator('.node').first();
    await firstNode.hover();
    await page.waitForTimeout(300);

    // Check tooltip is visible
    const tooltip = await page.locator('#tooltip');
    expect(await tooltip.isVisible()).toBe(true);

    // Move mouse away
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);

    // Tooltip should be hidden
    const isVisibleAfter = await tooltip.isVisible();
    expect(isVisibleAfter).toBe(false);
  });

  test('tooltip has category badge', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const firstNode = await page.locator('.node').first();
    await firstNode.hover();
    await page.waitForTimeout(300);

    const category = await page.locator('.tooltip-category');
    const categoryText = await category.textContent();
    expect(categoryText).toBeTruthy();
    expect(categoryText.length).toBeGreaterThan(0);
  });

  test('clicking bubble on desktop opens GitHub URL', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Listen for popup
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('.node').first().click(),
    ]);

    // Popup should be a GitHub URL
    expect(popup.url()).toContain('github.com');
    await popup.close();
  });
});
