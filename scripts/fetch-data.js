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
    strong: ['tensorflow', 'pytorch', 'huggingface', 'langchain', 'openai', 'anthropic', 'transformers', 'llm', 'gpt', 'chatgpt', 'claude', 'gemini', 'llama', 'bert', 'neural-network', 'deep-learning', 'machine-learning'],
    medium: ['ai', 'ml', 'rag', 'embedding', 'model-training', 'inference', 'nlp', 'computer-vision', 'generative', 'diffusion'],
    weak: ['agent', 'semantic', 'vector']
  },
  'cloud': {
    strong: ['aws', 'azure', 'gcp', 'google-cloud', 'cloud-native', 'eks', 'aks', 'gke', 'cloudformation', 'terraform', 'pulumi'],
    medium: ['cloud', 'infrastructure-as-code', 'iac', 'aws-cdk', 'serverless', 'lambda', 'cloud-functions'],
    weak: ['infrastructure', 'deployment']
  },
  'devops': {
    strong: ['kubernetes', 'k8s', 'docker', 'helm', 'argocd', 'gitlab-ci', 'github-actions', 'circleci', 'jenkins'],
    medium: ['ci-cd', 'continuous-integration', 'continuous-deployment', 'devops', 'gitops', 'containerization', 'orchestration'],
    weak: ['deployment', 'pipeline', 'automation', 'ops']
  },
  'web-dev': {
    strong: ['react', 'nextjs', 'next.js', 'vue', 'vuejs', 'angular', 'svelte', 'remix', 'astro'],
    medium: ['frontend', 'backend', 'fullstack', 'web-framework', 'express', 'fastify', 'nestjs', 'tailwind', 'css'],
    weak: ['web', 'html', 'javascript', 'typescript']
  },
  'mobile': {
    strong: ['react-native', 'flutter', 'swift', 'kotlin', 'swiftui', 'jetpack-compose', 'expo'],
    medium: ['ios', 'android', 'mobile-development', 'mobile-app', 'xamarin', 'ionic'],
    weak: ['mobile']
  },
  'data': {
    strong: ['postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'apache-spark', 'apache-kafka', 'apache-airflow'],
    medium: ['database', 'data-engineering', 'etl', 'data-pipeline', 'data-warehouse', 'bigquery', 'snowflake'],
    weak: ['sql', 'nosql', 'analytics', 'data']
  },
  'monitoring': {
    strong: ['prometheus', 'grafana', 'datadog', 'new-relic', 'elasticsearch', 'kibana', 'jaeger', 'zipkin'],
    medium: ['observability', 'monitoring', 'logging', 'tracing', 'metrics', 'apm', 'alerting'],
    weak: ['logs', 'telemetry']
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
    strong: ['vscode', 'vim', 'neovim', 'cli-tool', 'command-line-tool'],
    medium: ['cli', 'command-line', 'terminal', 'shell', 'bash', 'developer-tools'],
    weak: ['tool', 'utility', 'productivity']
  },
  'security': {
    strong: ['oauth', 'jwt', 'authentication', 'authorization', 'encryption', 'vulnerability-scanner', 'penetration-testing'],
    medium: ['security', 'cybersecurity', 'infosec', 'secure', 'privacy', 'cryptography'],
    weak: ['auth', 'ssl', 'tls']
  },
  'api': {
    strong: ['graphql', 'rest-api', 'api-gateway', 'grpc', 'swagger', 'openapi'],
    medium: ['api', 'restful', 'microservices', 'api-client', 'sdk'],
    weak: ['endpoint', 'webhook']
  },
  'learning': {
    strong: ['tutorial', 'course', 'learning-resources', 'educational', 'coding-interview', 'examples'],
    medium: ['learning', 'education', 'guide', 'handbook', 'interview-prep'],
    weak: ['documentation', 'book', 'study']
  },
  'ui-ux': {
    strong: ['design-system', 'ui-components', 'component-library', 'tailwindcss', 'material-ui', 'shadcn'],
    medium: ['ui', 'ux', 'design', 'user-interface', 'frontend-framework'],
    weak: ['theme', 'icon', 'animation']
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

  // Find category with highest score (minimum threshold: 5 points)
  let bestCategory = 'other';
  let bestScore = 5;

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