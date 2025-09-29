#!/usr/bin/env node

/**
 * GitHub Stars Data Fetcher
 * Fetches all starred repositories for a user and outputs structured JSON
 */

const https = require('https');
const fs = require('fs');

const USERNAME = process.env.GITHUB_USERNAME || 'niranjanxprt';
const TOKEN = process.env.GITHUB_TOKEN;

// Enhanced categorization with comprehensive keywords
const categories = {
  'ai-ml': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural', 'llm', 'gpt', 'openai', 'anthropic', 'langchain', 'tensorflow', 'pytorch', 'huggingface', 'transformer', 'agent', 'rag', 'vector', 'claude', 'gemini', 'chatgpt', 'llama', 'bert', 'embedding', 'semantic'],
  'web-dev': ['react', 'next', 'nextjs', 'vue', 'vuejs', 'angular', 'svelte', 'web', 'frontend', 'backend', 'fullstack', 'css', 'html', 'tailwind', 'bootstrap', 'javascript', 'typescript', 'node', 'nodejs', 'express', 'fastapi', 'django', 'flask'],
  'mobile': ['react-native', 'flutter', 'ios', 'android', 'mobile', 'expo', 'swift', 'kotlin', 'xamarin', 'ionic', 'cordova', 'phonegap', 'native', 'app'],
  'devops': ['docker', 'kubernetes', 'k8s', 'ci/cd', 'deployment', 'infrastructure', 'terraform', 'ansible', 'jenkins', 'helm', 'argo', 'flux', 'monitoring', 'prometheus', 'grafana', 'ops'],
  'data': ['data', 'analytics', 'database', 'sql', 'postgres', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'spark', 'pandas', 'etl', 'warehouse', 'pipeline', 'airflow', 'kafka', 'bigdata', 'nosql'],
  'tools': ['cli', 'command line', 'editor', 'ide', 'extension', 'utility', 'productivity', 'automation', 'terminal', 'shell', 'bash', 'zsh', 'vim', 'vscode', 'tool', 'generator'],
  'security': ['security', 'auth', 'authentication', 'authorization', 'encryption', 'privacy', 'vulnerability', 'oauth', 'jwt', 'ssl', 'tls', 'crypto', 'cipher', 'hash', 'secure'],
  'api': ['api', 'rest', 'restful', 'graphql', 'sdk', 'client', 'server', 'microservice', 'webhook', 'endpoint', 'service', 'grpc'],
  'learning': ['tutorial', 'course', 'learning', 'education', 'examples', 'book', 'guide', 'documentation', 'handbook', 'interview', 'study', 'practice', 'exercise', 'challenge'],
  'ui-ux': ['ui', 'ux', 'design', 'component', 'library', 'theme', 'icon', 'animation', 'motion', 'transition', 'interface', 'user experience'],
  'blockchain': ['blockchain', 'crypto', 'cryptocurrency', 'ethereum', 'bitcoin', 'web3', 'solidity', 'nft', 'defi', 'smart contract', 'dapp'],
  'game-dev': ['game', 'gaming', 'unity', 'unreal', 'godot', 'engine', 'graphics', '3d', 'physics', 'simulation', 'gamedev'],
  'mcp': ['mcp', 'model context protocol', 'claude desktop', 'anthropic'],
  'python': ['python', 'py', 'django', 'flask', 'fastapi', 'pandas', 'numpy', 'scipy'],
  'other': []
};

function categorizeRepo(repo) {
  const text = `${repo.name || ''} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
  const repoLanguage = (repo.language || '').toLowerCase();
  
  // Special handling for Python
  if (repoLanguage === 'python' && (text.includes('python') || text.includes('django') || text.includes('flask'))) {
    return 'python';
  }
  
  for (const [cat, keywords] of Object.entries(categories)) {
    if (cat === 'other') continue;
    if (keywords.some(kw => text.includes(kw))) return cat;
  }
  return 'other';
}

async function fetchPage(page) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/users/${USERNAME}/starred?per_page=100&page=${page}`,
      headers: {
        'User-Agent': 'starred-repos-graph/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    
    if (TOKEN) {
      options.headers['Authorization'] = `Bearer ${TOKEN}`;
    }
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse JSON response'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function fetchAllRepositories() {
  let page = 1;
  let allRepos = [];
  
  console.error(`Starting to fetch starred repositories for ${USERNAME}...`);
  
  while (page <= 10) { // Limit to 10 pages (1000 repos max)
    try {
      console.error(`Fetching page ${page}...`);
      const repos = await fetchPage(page);
      
      if (repos.length === 0) {
        console.error('No more repositories found.');
        break;
      }
      
      const processed = repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        owner: repo.owner.login,
        fullName: repo.full_name,
        description: (repo.description || '').replace(/[\\\"\\n\\r]/g, ' ').trim(),
        url: repo.html_url,
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        category: categorizeRepo(repo),
        updatedAt: repo.updated_at,
        topics: repo.topics || []
      }));
      
      allRepos = allRepos.concat(processed);
      console.error(`Total repositories collected: ${allRepos.length}`);
      
      page++;
      
      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error fetching page ${page}: ${error.message}`);
      if (page === 1) {
        throw error; // Fail if we can't get any data
      }
      break; // Continue with partial data
    }
  }
  
  return allRepos;
}

async function main() {
  try {
    const repos = await fetchAllRepositories();
    console.error(`Successfully fetched ${repos.length} repositories`);
    
    // Calculate category statistics
    const categoryStats = {};
    const languageStats = {};
    
    repos.forEach(repo => {
      categoryStats[repo.category] = (categoryStats[repo.category] || 0) + 1;
      languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
    });
    
    const data = {
      repositories: repos,
      lastUpdated: new Date().toISOString(),
      totalCount: repos.length,
      categoryStats,
      languageStats,
      metadata: {
        fetchedAt: new Date().toISOString(),
        username: USERNAME,
        version: '2.1'
      }
    };
    
    // Output JSON to stdout (for GitHub Actions)
    console.log(JSON.stringify(data, null, 2));
    console.error(`✅ Data output complete - ${repos.length} repositories`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fetchAllRepositories, categorizeRepo };