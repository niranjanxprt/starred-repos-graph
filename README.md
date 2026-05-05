# GitHub Stars Explorer

Interactive, static GitHub Pages app for exploring a GitHub starred-repository collection with search, category filters, presets, CSV export, and a responsive force-directed graph.

[Live Demo](https://niranjanxprt.github.io/starred-repos-graph/) · [Update Workflow](https://github.com/niranjanxprt/starred-repos-graph/actions/workflows/update-data.yml)

## Current Dataset

- Total repositories: 1,574 in the checked-in dataset
- Last synced: May 5, 2026 19:23 UTC
- Source: GitHub Actions generated JSON
- Live GitHub count at validation time: 1,574, which GitHub rounds as `1.6k`
- Deployment target: GitHub Pages

The app shows the exact checked-in dataset count and marks data as stale if the sync timestamp is older than 24 hours.

## Features

- D3 force-directed graph with category-aware clustering and cluster labels
- Default `Sample` view with a small balanced set to keep first load easy to scan, especially on phones
- Presets for `Sample`, `All`, `Curated`, `Popular`, `Learning`, and `AI`
- Real-time search by name, owner, description, topics, and language
- Compact Top Matches panel for scannable search results
- Category, language, and star-count filters
- Exact count display, sync status, last synced date, and stale-data warning
- CSV export of repository names, URLs, categories, secondary categories, topics, stars, forks, and sync timestamp
- Mobile-responsive panels and touch-friendly graph interactions
- GitHub Pages friendly: static HTML, CSS, JavaScript, and JSON only

## Category Model

The generated data keeps the original `category` field for compatibility and adds a more external-user-friendly display taxonomy:

| Display Category | Count |
| --- | ---: |
| AI Agents | 263 |
| Frontend | 211 |
| Docs/Reference | 189 |
| Backend/API | 128 |
| AI Models | 105 |
| AI Learning | 82 |
| Other | 78 |
| Python | 77 |
| Developer Tools | 77 |
| RAG/Search | 71 |
| Full-stack Frameworks | 44 |
| Career/Interview | 41 |
| LLM Apps | 38 |
| Databases | 34 |
| Systems/Low-level | 33 |

Repositories can also include `secondaryCategories` so visitors can understand cross-cutting projects without breaking older consumers of `data/repositories.json`.

## Project Structure

```text
starred-repos-graph/
├── index.html
├── app.js
├── data/
│   └── repositories.json
├── scripts/
│   ├── fetch-data.js
│   ├── clean-data.js
│   └── validate-data.js
├── tests/
│   └── e2e/
└── .github/workflows/
    └── update-data.yml
```

## Local Development

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

Run validation:

```bash
node --check app.js
node --check scripts/fetch-data.js
node --check scripts/validate-data.js
node scripts/validate-data.js
```

Run browser tests:

```bash
cd tests
npm install
npm test -- --project=chromium
```

## Updating The Dataset

The scheduled GitHub Actions workflow fetches starred repositories, categorizes them, validates the JSON, commits data changes, and deploys the static app to GitHub Pages.

For a different account, set `GITHUB_USERNAME` in the workflow or run locally:

```bash
GITHUB_USERNAME=your-github-username node scripts/fetch-data.js > data/repositories.json
node scripts/validate-data.js
```

The app can be configured from the small config object in `app.js` for username, repository URL, workflow URL, and stale-data threshold.

## CI/CD Safety

The validation script checks:

- JSON shape and required repository fields
- `totalCount` against the actual repository array length
- dataset age and stale-data threshold
- category distribution and `Other` ratio
- secondary category presence
- live GitHub starred count within a small tolerance

This keeps the project static and GitHub Pages compatible while making count mismatches visible before deployment.
