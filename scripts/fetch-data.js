#!/usr/bin/env node

/**
 * GitHub Stars Data Fetcher
 * Fetches all starred repositories for a user and outputs structured JSON
 */

const https = require('https');
const fs = require('fs');

const USERNAME = process.env.GITHUB_USERNAME || 'niranjanxprt';
const TOKEN = process.env.GITHUB_TOKEN;

// Enhanced category definitions with weighted keyword scoring
const categories = {
  'ai-ml': {
    strong: ['tensorflow', 'pytorch', 'huggingface', 'langchain', 'openai', 'anthropic', 'transformers', 'llm', 'gpt', 'chatgpt', 'claude', 'gemini', 'llama', 'bert', 'neural-network', 'deep-learning', 'machine-learning', 'prompt-engineering', 'prompt-optimization', 'agent-framework', 'agentic-ai', 'deepagents', 'dspy', 'reinforcement-learning'],
    medium: ['ai', 'ml', 'rag', 'embedding', 'model-training', 'inference', 'nlp', 'computer-vision', 'generative', 'diffusion', 'ai-powered', 'ai-agent', 'ai-assistant', 'llm-ops', 'model-context-protocol', 'ai-native'],
    weak: ['agent', 'semantic', 'vector', 'optimization', 'prompt']
  },
  'cloud': {
    strong: ['aws', 'azure', 'gcp', 'google-cloud', 'cloud-native', 'eks', 'aks', 'gke', 'cloudformation', 'terraform', 'pulumi', 'cdn', 'cloudflare'],
    medium: ['cloud', 'infrastructure-as-code', 'iac', 'aws-cdk', 'serverless', 'lambda', 'cloud-functions', 'edge-computing', 'esm'],
    weak: ['infrastructure', 'deployment', 'hosting']
  },
  'devops': {
    strong: ['kubernetes', 'k8s', 'docker', 'helm', 'argocd', 'gitlab-ci', 'github-actions', 'circleci', 'jenkins', 'ansible', 'vagrant', 'backup-automation', 'prometheus-exporter'],
    medium: ['ci-cd', 'continuous-integration', 'continuous-deployment', 'devops', 'gitops', 'containerization', 'orchestration', 'self-hosted', 'homelab', 'sre', 'site-reliability', 'backup'],
    weak: ['deployment', 'pipeline', 'automation', 'ops', 'self-hosters']
  },
  'web-dev': {
    strong: ['react', 'nextjs', 'next.js', 'vue', 'vuejs', 'angular', 'svelte', 'remix', 'astro', 'browser-engine', 'web-browser', 'chromium', 'webkit', 'static-site-generator', 'ssg'],
    medium: ['frontend', 'backend', 'fullstack', 'web-framework', 'express', 'fastify', 'nestjs', 'tailwind', 'css', 'browser', 'web-development', 'obsidian-md', 'markdown-editor', 'nobuild'],
    weak: ['web', 'html', 'javascript', 'typescript', 'markdown', 'mdx']
  },
  'mobile': {
    strong: ['react-native', 'flutter', 'swift', 'kotlin', 'swiftui', 'jetpack-compose', 'expo'],
    medium: ['ios', 'android', 'mobile-development', 'mobile-app', 'xamarin', 'ionic'],
    weak: ['mobile']
  },
  'data': {
    strong: ['postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'apache-spark', 'apache-kafka', 'apache-airflow', 'gpu-programming', 'cuda-programming', 'gpu-engineering'],
    medium: ['database', 'data-engineering', 'etl', 'data-pipeline', 'data-warehouse', 'bigquery', 'snowflake', 'kernels', 'gpu', 'cuda'],
    weak: ['sql', 'nosql', 'analytics', 'data', 'pandas', 'numpy']
  },
  'monitoring': {
    strong: ['prometheus', 'grafana', 'datadog', 'new-relic', 'elasticsearch', 'kibana', 'jaeger', 'zipkin', 'web-analytics', 'google-analytics', 'mixpanel', 'amplitude', 'umami'],
    medium: ['observability', 'monitoring', 'logging', 'tracing', 'metrics', 'apm', 'alerting', 'analytics', 'product-analytics', 'audience-segmentation', 'cohort-analysis', 'user-journey'],
    weak: ['logs', 'telemetry', 'statistics', 'tracking']
  },
  'testing': {
    strong: ['jest', 'pytest', 'cypress', 'selenium', 'playwright', 'junit', 'testng', 'mocha'],
    medium: ['testing', 'test-automation', 'unit-testing', 'integration-testing', 'e2e-testing', 'tdd', 'bdd'],
    weak: ['test', 'qa', 'quality-assurance']
  },
  'python': {
    strong: ['django', 'flask', 'fastapi', 'pandas', 'numpy', 'scipy', 'scikit-learn'],
    medium: ['python', 'python3', 'pythonic'],
    weak: ['py']
  },
  'tools': {
    strong: ['vscode', 'vim', 'neovim', 'cli-tool', 'command-line-tool', 'browser-extension', 'chrome-extension', 'firefox-addon', 'text-editor', 'productivity-tool'],
    medium: ['cli', 'command-line', 'terminal', 'shell', 'bash', 'developer-tools', 'chrome', 'firefox', 'safari', 'edge', 'opera', 'code-review', 'pull-request-review', 'github-tool', 'self-hosted-tools'],
    weak: ['tool', 'utility', 'productivity', 'extension', 'addon', 'plugin']
  },
  'security': {
    strong: ['oauth', 'jwt', 'authentication', 'authorization', 'encryption', 'vulnerability-scanner', 'penetration-testing', 'soc2', 'iso27001', 'gdpr', 'hipaa', 'compliance'],
    medium: ['security', 'cybersecurity', 'infosec', 'secure', 'privacy', 'cryptography', 'grc', 'governance', 'risk-management', 'compliance-automation', 'iso27701', 'iso42001'],
    weak: ['auth', 'ssl', 'tls', 'audit']
  },
  'api': {
    strong: ['graphql', 'rest-api', 'api-gateway', 'grpc', 'swagger', 'openapi'],
    medium: ['api', 'restful', 'microservices', 'api-client', 'sdk'],
    weak: ['endpoint', 'webhook']
  },
  'learning': {
    strong: ['tutorial', 'course', 'learning-resources', 'educational', 'coding-interview', 'examples', 'awesome-list', 'curated-list', 'learning-path', 'study-guide', 'cheat-sheet'],
    medium: ['learning', 'education', 'guide', 'handbook', 'interview-prep', 'awesome', 'resources', 'list', 'collection', 'curated', 'flashcard', 'spaced-repetition'],
    weak: ['documentation', 'book', 'study', 'reference']
  },
  'ui-ux': {
    strong: ['design-system', 'ui-components', 'component-library', 'tailwindcss', 'material-ui', 'shadcn', 'gui-framework', 'gpui', 'uikit', 'swiftui', 'jetpack-compose'],
    medium: ['ui', 'ux', 'design', 'user-interface', 'frontend-framework', 'desktop-application', 'canvas', 'graphics', 'pixel-art', 'isometric'],
    weak: ['theme', 'icon', 'animation', 'visual']
  },
  'blockchain': {
    strong: ['ethereum', 'solidity', 'web3', 'smart-contract', 'defi', 'nft'],
    medium: ['blockchain', 'cryptocurrency', 'bitcoin', 'dapp'],
    weak: ['crypto']
  },
  'game-dev': {
    strong: ['unity', 'unreal', 'godot', 'game-engine'],
    medium: ['game-development', 'gamedev', 'gaming'],
    weak: ['game', '3d', 'physics-engine']
  },
  'mcp': {
    strong: ['mcp', 'model-context-protocol', 'claude-desktop'],
    medium: ['anthropic'],
    weak: []
  },
  'networking': {
    strong: ['networking', 'network-programming', 'tcp-ip', 'http', 'dns', 'load-balancer'],
    medium: ['protocol', 'socket', 'websocket', 'network'],
    weak: []
  },
  'system-design': {
    strong: ['system-design', 'system-architecture', 'distributed-systems', 'distributed-system', 'scalability', 'high-availability', 'microservices-architecture', 'system-design-interview', 'architecture-patterns', 'design-patterns', 'software-architecture'],
    medium: ['architecture', 'scalable', 'distributed', 'high-performance', 'load-balancing', 'caching', 'message-queue', 'event-driven', 'microservices-pattern', 'architectural'],
    weak: ['pattern', 'architecture-diagram', 'system']
  },
  'other': {}
};

function categorizeRepo(repo) {
  // Extract and normalize data
  const name = (repo.name || '').toLowerCase();
  const description = (repo.description || '').toLowerCase();
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  const language = (repo.language || '').toLowerCase();

  // Combine all text for keyword matching
  const allText = `${name} ${description} ${topics.join(' ')}`;

  // Create word boundary regex for more precise matching
  const createWordRegex = (keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i');
  };

  // Score each category
  const categoryScores = {};

  for (const [category, keywordGroups] of Object.entries(categories)) {
    if (category === 'other') continue;

    let score = 0;

    // Strong keywords: 10 points
    if (keywordGroups.strong) {
      for (const keyword of keywordGroups.strong) {
        if (createWordRegex(keyword).test(allText)) {
          score += 10;
          // Bonus for topic match
          if (topics.some(t => t.includes(keyword.toLowerCase()))) {
            score += 5;
          }
        }
      }
    }

    // Medium keywords: 5 points
    if (keywordGroups.medium) {
      for (const keyword of keywordGroups.medium) {
        if (createWordRegex(keyword).test(allText)) {
          score += 5;
          if (topics.some(t => t.includes(keyword.toLowerCase()))) {
            score += 3;
          }
        }
      }
    }

    // Weak keywords: 2 points
    if (keywordGroups.weak) {
      for (const keyword of keywordGroups.weak) {
        if (createWordRegex(keyword).test(allText)) {
          score += 2;
        }
      }
    }

    categoryScores[category] = score;
  }

  // Language-based boosts
  if (language === 'python') {
    categoryScores['python'] = (categoryScores['python'] || 0) + 8;
  }
  if (language === 'javascript' || language === 'typescript') {
    categoryScores['web-dev'] = (categoryScores['web-dev'] || 0) + 3;
  }
  if (language === 'swift' || language === 'kotlin') {
    categoryScores['mobile'] = (categoryScores['mobile'] || 0) + 8;
  }
  if (language === 'go' || language === 'rust') {
    categoryScores['tools'] = (categoryScores['tools'] || 0) + 3;
    categoryScores['devops'] = (categoryScores['devops'] || 0) + 3;
  }
  if (language === 'hcl' || language === 'terraform') {
    categoryScores['cloud'] = (categoryScores['cloud'] || 0) + 10;
  }
  if (language === 'dockerfile') {
    categoryScores['devops'] = (categoryScores['devops'] || 0) + 8;
  }

  // Special case: if repo has "kubernetes" and "example", prefer devops over learning
  if (allText.includes('kubernetes') && allText.includes('example')) {
    categoryScores['devops'] = (categoryScores['devops'] || 0) + 10;
    categoryScores['learning'] = Math.max(0, (categoryScores['learning'] || 0) - 5);
  }

  // Special case: Backup/automation tools
  if (allText.includes('backup') && (allText.includes('automation') || allText.includes('self-hosted'))) {
    categoryScores['devops'] = (categoryScores['devops'] || 0) + 8;
  }

  // Special case: Browser engines
  if (allText.includes('browser') && (allText.includes('engine') || allText.includes('chromium') || allText.includes('webkit'))) {
    categoryScores['web-dev'] = (categoryScores['web-dev'] || 0) + 10;
  }

  // Special case: AI agent frameworks
  if ((allText.includes('agent') || allText.includes('agentic')) && (allText.includes('ai') || allText.includes('llm'))) {
    categoryScores['ai-ml'] = (categoryScores['ai-ml'] || 0) + 8;
  }

  // Special case: Analytics platforms
  if (allText.includes('analytics') && (allText.includes('platform') || allText.includes('alternative') || allText.includes('dashboard'))) {
    categoryScores['monitoring'] = (categoryScores['monitoring'] || 0) + 8;
  }

  // Special case: Browser extensions
  if ((allText.includes('browser-extension') || allText.includes('chrome-extension')) ||
      (allText.includes('chrome') && allText.includes('extension'))) {
    categoryScores['tools'] = (categoryScores['tools'] || 0) + 10;
  }

  // Special case: Static site generators
  if (allText.includes('static-site') || (allText.includes('site') && allText.includes('generator'))) {
    categoryScores['web-dev'] = (categoryScores['web-dev'] || 0) + 8;
  }

  // Special case: Compliance/security tools
  if ((allText.includes('compliance') || allText.includes('soc2') || allText.includes('gdpr')) &&
      !allText.includes('ai-native')) {
    categoryScores['security'] = (categoryScores['security'] || 0) + 10;
  }

  // Special case: Awesome lists and curated resources
  if ((allText.includes('awesome') && allText.includes('list')) ||
      (allText.includes('curated') && (allText.includes('list') || allText.includes('collection')))) {
    categoryScores['learning'] = (categoryScores['learning'] || 0) + 12;
  }

  // Special case: GUI/Desktop frameworks
  if ((allText.includes('gui') || allText.includes('desktop-application')) &&
      (allText.includes('framework') || allText.includes('components'))) {
    categoryScores['ui-ux'] = (categoryScores['ui-ux'] || 0) + 8;
  }

  // Special case: System Design resources
  if ((allText.includes('system-design') || allText.includes('system design')) ||
      ((allText.includes('distributed') || allText.includes('scalability')) &&
       (allText.includes('architecture') || allText.includes('interview')))) {
    categoryScores['system-design'] = (categoryScores['system-design'] || 0) + 12;
  }

  // Find category with highest score (minimum threshold: 4 points)
  let bestCategory = 'other';
  let bestScore = 4;

  for (const [category, score] of Object.entries(categoryScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
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
  const MAX_PAGES = 100; // Safety limit: 100 pages = 10,000 repos max

  console.error(`Starting to fetch starred repositories for ${USERNAME}...`);

  while (page <= MAX_PAGES) {
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
        description: (repo.description || '').replace(/["\n\r]/g, ' ').trim(),
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