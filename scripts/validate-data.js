#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

const DATA_PATH = process.env.DATA_PATH || 'data/repositories.json';
const USERNAME = process.env.GITHUB_USERNAME || 'niranjanxprt';
const TOKEN = process.env.GITHUB_TOKEN;
const MAX_DATA_AGE_HOURS = Number(process.env.MAX_DATA_AGE_HOURS || 24);
const MAX_OTHER_RATIO = Number(process.env.MAX_OTHER_RATIO || 0.12);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function warn(message) {
  console.warn(`WARN: ${message}`);
}

function request(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'starred-repos-graph-validator/1.0',
      'Accept': 'application/vnd.github+json'
    };
    if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

    const req = https.request({ hostname: 'api.github.com', path, method, headers }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function getLiveStarredCount() {
  const first = await request(`/users/${USERNAME}/starred?per_page=100&page=1`, 'HEAD');
  if (first.status < 200 || first.status >= 300) {
    throw new Error(`GitHub API HEAD failed with HTTP ${first.status}`);
  }

  const link = first.headers.link || '';
  const lastPage = Number(link.match(/page=(\d+)>; rel="last"/)?.[1] || 1);
  if (lastPage === 1) {
    const page = await request(`/users/${USERNAME}/starred?per_page=100&page=1`);
    return JSON.parse(page.body).length;
  }

  const last = await request(`/users/${USERNAME}/starred?per_page=100&page=${lastPage}`);
  if (last.status < 200 || last.status >= 300) {
    throw new Error(`GitHub API last page failed with HTTP ${last.status}`);
  }
  return (lastPage - 1) * 100 + JSON.parse(last.body).length;
}

async function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(raw);
  const repos = data.repositories;

  if (!Array.isArray(repos)) fail('repositories must be an array');
  if (data.totalCount !== repos.length) fail(`totalCount ${data.totalCount} does not match repositories length ${repos.length}`);
  if (!data.lastUpdated || Number.isNaN(new Date(data.lastUpdated).getTime())) fail('lastUpdated must be a valid ISO timestamp');

  const ageHours = (Date.now() - new Date(data.lastUpdated).getTime()) / (1000 * 60 * 60);
  if (ageHours > MAX_DATA_AGE_HOURS) fail(`data is stale: ${Math.round(ageHours)}h old`);

  const missingRequired = repos.filter(repo => !repo.id || !repo.name || !repo.fullName || !repo.url || !repo.category);
  if (missingRequired.length > 0) fail(`${missingRequired.length} repositories are missing required fields`);

  const missingSecondary = repos.filter(repo => !Array.isArray(repo.secondaryCategories) || repo.secondaryCategories.length === 0);
  if (missingSecondary.length > 0) fail(`${missingSecondary.length} repositories are missing secondaryCategories`);

  const otherCount = repos.filter(repo => (repo.displayCategory || repo.category) === 'other').length;
  const otherRatio = repos.length === 0 ? 0 : otherCount / repos.length;
  if (otherRatio > MAX_OTHER_RATIO) {
    fail(`Other category ratio ${(otherRatio * 100).toFixed(1)}% exceeds ${(MAX_OTHER_RATIO * 100).toFixed(1)}%`);
  } else if (otherRatio > 0.07) {
    warn(`Other category ratio is ${(otherRatio * 100).toFixed(1)}%; target is 5-7% over time`);
  }

  if (process.env.SKIP_LIVE_COUNT !== 'true') {
    const liveCount = await getLiveStarredCount();
    if (Math.abs(liveCount - repos.length) > Number(process.env.LIVE_COUNT_TOLERANCE || 5)) {
      fail(`live GitHub starred count ${liveCount} differs from dataset count ${repos.length}`);
    }
    console.error(`Live count check: ${liveCount}; dataset count: ${repos.length}`);
  }

  if (process.exitCode) process.exit(process.exitCode);
  console.error(`Data validation passed for ${repos.length} repositories`);
}

main().catch(error => {
  fail(error.message);
  process.exit(process.exitCode);
});
