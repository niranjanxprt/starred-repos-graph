# Playwright Tests for GitHub Stars Graph

Automated browser tests for the GitHub Stars Graph visualization using Playwright.

## Setup

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug
```

## Test Suites

### smoke.spec.js
- Page loads successfully
- SVG graph element renders
- At least 100 bubbles are visible
- Stats display non-zero values
- No console errors on load
- Header elements are visible

### filter.spec.js
- Category filter reduces node count
- Stars filter works correctly
- "All" filter shows all repositories
- Filter button active state changes

### search.spec.js
- Search input reduces node count
- Search with no results shows empty state
- Clear search resets repositories
- Escape key clears search
- Search is case-insensitive

### tooltip.spec.js
- Hovering shows tooltip
- Tooltip contains repository title
- Tooltip shows star count
- Mouseout hides tooltip
- Tooltip has category badge
- Clicking bubble opens GitHub URL

### responsive.spec.js
- Mobile: controls panel starts hidden
- Mobile: toggle opens/closes panel
- Desktop: sidebar visible
- Tablet: proper layout
- Mobile landscape: graph visible
- Header is responsive on mobile
- Bubbles scale appropriately on all viewports
- Touch targets are large enough on mobile

## Continuous Integration

Tests are configured to run in CI with:
- 1 worker (sequential execution)
- 2 retries on failure
- HTML report generation

To run locally with CI settings:
```bash
CI=true npm test
```

## Browser Coverage

- **Chromium** (Desktop Chrome)
- **Firefox** (Desktop Firefox)
- **iPhone 14** (iOS mobile)
- **iPad Pro** (Tablet)

## Test Results

After running tests, open the report:
```bash
npx playwright show-report
```

## Troubleshooting

### Web server doesn't start
Ensure the parent directory has `index.html` and `app.js`:
```bash
cd ..
npx --yes serve@14 . --listen 8080
```

### Tests timeout
Increase the test timeout in `playwright.config.js`:
```js
timeout: 30 * 1000, // 30 seconds
```

### Mobile tests fail
Ensure viewport sizes match the device profiles. Check the Playwright docs for device configurations:
https://playwright.dev/docs/emulation#devices
