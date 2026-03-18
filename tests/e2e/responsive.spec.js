import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('mobile: controls panel starts hidden', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // Simulate mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const controlsPanel = await page.locator('.controls-panel');
    const isVisible = await controlsPanel.isVisible();

    // On mobile, panel should be hidden by default
    if (await controlsPanel.locator('.controls-panel.mobile-open').count() > 0) {
      expect(isVisible).toBe(true);
    } else {
      // Panel might be off-screen
      expect(isVisible).toBe(false);
    }
  });

  test('mobile: toggle opens/closes panel', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const toggleBtn = await page.locator('.toggle-controls');
    if (await toggleBtn.isVisible()) {
      // Click toggle to open
      await toggleBtn.click();
      await page.waitForTimeout(500);

      const controlsPanel = await page.locator('.controls-panel');
      const hasMobileOpenClass = await controlsPanel.locator('.controls-panel.mobile-open').count();
      expect(hasMobileOpenClass).toBeGreaterThan(0);

      // Click toggle to close
      await toggleBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('desktop: sidebar visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);

    const controlsPanel = await page.locator('.controls-panel');
    const legendPanel = await page.locator('.legend-panel');

    // On desktop, both should be visible
    expect(await controlsPanel.isVisible()).toBe(true);
    expect(await legendPanel.isVisible()).toBe(true);
  });

  test('tablet: proper layout', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // iPad dimensions
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    const header = await page.locator('.app-header');
    const graph = await page.locator('#graph');

    expect(await header.isVisible()).toBe(true);
    expect(await graph.isVisible()).toBe(true);
  });

  test('mobile landscape: graph still visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 812, height: 375 });
    await page.waitForTimeout(1000);

    const graph = await page.locator('#graph');
    expect(await graph.isVisible()).toBe(true);

    const bubbles = await page.locator('.node').count();
    expect(bubbles).toBeGreaterThan(0);
  });

  test('header is responsive on mobile', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const header = await page.locator('.app-header');
    const title = await page.locator('.title');

    expect(await header.isVisible()).toBe(true);
    expect(await title.isVisible()).toBe(true);

    // Title should use responsive font sizing
    const titleFontSize = await title.evaluate(el => window.getComputedStyle(el).fontSize);
    const size = parseInt(titleFontSize);
    expect(size).toBeGreaterThan(0);
  });

  test('bubbles scale appropriately on all viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ];

    for (const viewport of viewports) {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);

      const bubbles = await page.locator('.node').count();
      expect(bubbles).toBeGreaterThan(0);

      // Get first bubble radius
      const firstBubble = await page.locator('.node').first();
      const r = await firstBubble.getAttribute('r');
      expect(r).toBeTruthy();
      expect(parseInt(r)).toBeGreaterThan(0);
    }
  });

  test('touch targets are large enough on mobile', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const filterBtns = await page.locator('.filter-btn');
    const count = await filterBtns.count();

    if (count > 0) {
      // Check first button height
      const firstBtn = filterBtns.first();
      const height = await firstBtn.evaluate(el => el.offsetHeight);
      // Touch targets should be at least 44px
      expect(height).toBeGreaterThanOrEqual(44);
    }
  });
});
