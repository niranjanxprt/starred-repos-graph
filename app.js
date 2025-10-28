// GitHub Stars Graph Visualization - Enhanced Implementation
class GitHubStarsGraph {
    constructor() {
        this.repositories = [];
        this.filteredRepositories = [];
        this.simulation = null;
        this.svg = null;
        this.tooltip = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dataLastUpdated = null; // ISO timestamp when data was last updated
        this.dataSource = null; // 'cached' (Actions JSON) | 'live' (API)
        
        // Enhanced category definitions with weighted keyword scoring
        // Format: { keyword: weight } where higher weight = stronger indicator
        this.categories = {
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
        
        // Enhanced color scheme with better contrast and clustering
        this.categoryColors = {
            'ai-ml': '#8B5CF6',      // Purple - prominent for AI
            'cloud': '#F59E0B',      // Amber - cloud infrastructure
            'devops': '#06B6D4',     // Cyan - infrastructure
            'web-dev': '#10B981',    // Emerald - fresh for web
            'mobile': '#EF4444',     // Red - mobile energy
            'data': '#3B82F6',       // Blue - data ocean
            'monitoring': '#F97316', // Orange - observability
            'testing': '#84CC16',    // Lime - quality
            'python': '#FBBF24',     // Yellow - Python's signature color
            'tools': '#6B7280',      // Gray - utility
            'security': '#DC2626',   // Dark red - security
            'api': '#9333EA',        // Violet - connections
            'learning': '#22C55E',   // Green - growth
            'ui-ux': '#EC4899',      // Pink - design
            'blockchain': '#D97706', // Gold - crypto
            'game-dev': '#FB923C',   // Orange - gaming fun
            'mcp': '#A855F7',        // Purple variant - special
            'networking': '#0EA5E9', // Sky blue - network
            'other': '#6366F1'       // Indigo - general
        };
        
        this.currentFilters = {
            search: '',
            category: 'all',
            language: 'all',
            stars: 'all'
        };
        
        this.init();
    }
    
    async init() {
        try {
            this.setupEventListeners();
            await this.loadRepositories();
            this.setupGraph();
            this.setupFilters();
            this.setupLegend();
            this.hideLoading();
            console.log('GitHub Stars Graph initialized successfully!');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError(`Failed to initialize: ${error.message}`);
        }
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
        
        // Stars filters
        document.querySelectorAll('#stars-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#stars-filters .filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilters.stars = e.target.dataset.stars;
                this.applyFilters();
            });
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.resetFilters();
            }
        });

        // Refresh button -> open GitHub Actions Run Workflow page in a new tab
        const refreshBtn = document.getElementById('refresh-now');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const workflowUrl = 'https://github.com/niranjanxprt/starred-repos-graph/actions/workflows/update-data.yml';
                window.open(workflowUrl, '_blank');
            });
        }

        // Mobile menu toggles
        const toggleControls = document.getElementById('toggle-controls');
        const toggleLegend = document.getElementById('toggle-legend');
        const closeControls = document.getElementById('close-controls');
        const closeLegend = document.getElementById('close-legend');
        const controlsPanel = document.getElementById('controls-panel');
        const legendPanel = document.getElementById('legend-panel');

        if (toggleControls && controlsPanel) {
            toggleControls.addEventListener('click', () => {
                controlsPanel.classList.add('mobile-open');
                legendPanel.classList.remove('mobile-open');
            });
        }

        if (toggleLegend && legendPanel) {
            toggleLegend.addEventListener('click', () => {
                legendPanel.classList.add('mobile-open');
                controlsPanel.classList.remove('mobile-open');
            });
        }

        if (closeControls && controlsPanel) {
            closeControls.addEventListener('click', () => {
                controlsPanel.classList.remove('mobile-open');
            });
        }

        if (closeLegend && legendPanel) {
            closeLegend.addEventListener('click', () => {
                legendPanel.classList.remove('mobile-open');
            });
        }

        // Close panels when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 767) {
                const isClickInsideControls = controlsPanel.contains(e.target);
                const isClickInsideLegend = legendPanel.contains(e.target);
                const isToggleButton = e.target.closest('.mobile-toggle');

                if (!isClickInsideControls && !isClickInsideLegend && !isToggleButton) {
                    controlsPanel.classList.remove('mobile-open');
                    legendPanel.classList.remove('mobile-open');
                }
            }
        });

        // Close panels on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                controlsPanel.classList.remove('mobile-open');
                legendPanel.classList.remove('mobile-open');
            }
        });
    }
    
    async loadRepositories() {
        const username = 'niranjanxprt';
        
        try {
            this.updateProgress('Connecting to data source...');
            
            // Try to load from data file first (if GitHub Actions has run)
            try {
                const response = await fetch('./data/repositories.json');
                if (response.ok) {
                    const data = await response.json();
                    this.repositories = data.repositories || [];
                    this.dataLastUpdated = data.lastUpdated || null;
                    this.dataSource = 'cached';
                    console.log(`Loaded ${this.repositories.length} repositories from data file`);
                    this.updateStats();
                    return;
                }
            } catch (e) {
                console.log('Data file not found, fetching from GitHub API...');
            }
            
            // Fallback: Fetch directly from GitHub API
            let page = 1;
            const perPage = 100;
            this.repositories = [];
            this.dataSource = 'live';
            
            this.updateProgress('Fetching repository data from GitHub API...');
            
            while (page <= 8) { // Maximum 8 pages to get ~700+ repos
                try {
                    const url = `https://api.github.com/users/${username}/starred?per_page=${perPage}&page=${page}`;
                    
                    const response = await fetch(url);
                    
                    if (!response.ok) {
                        if (response.status === 403) {
                            throw new Error('GitHub API rate limit exceeded. The app will use cached data or try again later.');
                        }
                        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
                    }
                    
                    const repos = await response.json();
                    
                    if (repos.length === 0) break;
                    
                    const processedRepos = repos.map(repo => ({
                        id: repo.id,
                        name: repo.name,
                        owner: repo.owner.login,
                        fullName: repo.full_name,
                        description: repo.description || '',
                        url: repo.html_url,
                        language: repo.language || 'Unknown',
                        stars: repo.stargazers_count,
                        forks: repo.forks_count,
                        updatedAt: repo.updated_at,
                        topics: repo.topics || [],
                        category: this.categorizeRepo(repo)
                    }));
                    
                    this.repositories = this.repositories.concat(processedRepos);
                    
                    this.updateProgress(`Loading repositories... ${this.repositories.length} found`);
                    
                    page++;
                    
                    // Small delay to be nice to GitHub API
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                } catch (error) {
                    console.error(`Error fetching page ${page}:`, error);
                    if (this.repositories.length === 0) {
                        throw error;
                    }
                    break;
                }
            }
            
            console.log(`Successfully loaded ${this.repositories.length} repositories`);
            // Mark last updated from live API fetch time if file wasn't used
            if (!this.dataLastUpdated) {
                this.dataLastUpdated = new Date().toISOString();
            }
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading repositories:', error);
            
            // Show error but try to continue with sample data for demo
            this.showError(`Error loading data: ${error.message}. Please refresh to try again.`);
            
            // Set empty repositories to show error state
            this.repositories = [];
            this.updateStats();
        }
    }
    
    updateProgress(message) {
        const progressText = document.getElementById('progress-text');
        if (progressText) {
            progressText.textContent = message;
        }
    }
    
    categorizeRepo(repo) {
        // Extract and normalize data
        const name = (repo.name || '').toLowerCase();
        const description = (repo.description || '').toLowerCase();
        const topics = (repo.topics || []).map(t => t.toLowerCase());
        const language = (repo.language || '').toLowerCase();

        // Combine all text for keyword matching
        const allText = `${name} ${description} ${topics.join(' ')}`;

        // Create word boundary regex for more precise matching
        const createWordRegex = (keyword) => {
            // Handle hyphenated keywords and special characters
            const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(`\\b${escaped}\\b`, 'i');
        };

        // Score each category
        const categoryScores = {};

        for (const [category, keywordGroups] of Object.entries(this.categories)) {
            if (category === 'other') continue;

            let score = 0;

            // Strong keywords: 10 points
            if (keywordGroups.strong) {
                for (const keyword of keywordGroups.strong) {
                    if (createWordRegex(keyword).test(allText)) {
                        score += 10;
                        // Bonus for topic match (topics are curated and more accurate)
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
    
    setupGraph() {
        this.svg = d3.select('#graph')
            .attr('width', this.width)
            .attr('height', this.height);
        
        this.tooltip = d3.select('#tooltip');
        
        // Clear existing content
        this.svg.selectAll('*').remove();
        
        // Create zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.svg.selectAll('g').attr('transform', event.transform);
            });
        
        this.svg.call(zoom);
        
        // Create main container group
        const g = this.svg.append('g').attr('class', 'main-group');
        
        // Enhanced force simulation for better clustering
        this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.id).distance(100).strength(0.1))
            .force('charge', d3.forceManyBody().strength(-200).distanceMax(300))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(d => this.getNodeRadius(d) + 3))
            // Add category-based positioning forces for better clustering
            .force('x', d3.forceX().x(d => this.getCategoryPosition(d.category).x).strength(0.1))
            .force('y', d3.forceY().y(d => this.getCategoryPosition(d.category).y).strength(0.1));
        
        this.filteredRepositories = [...this.repositories];
        this.updateVisualization();
    }
    
    getCategoryPosition(category) {
        // Strategic positioning for better visual clustering
        const positions = {
            // Corner positions (major categories)
            'ai-ml': { x: this.width * 0.15, y: this.height * 0.15 },     // Top-left
            'web-dev': { x: this.width * 0.85, y: this.height * 0.15 },   // Top-right
            'cloud': { x: this.width * 0.15, y: this.height * 0.85 },     // Bottom-left
            'data': { x: this.width * 0.85, y: this.height * 0.85 },      // Bottom-right

            // Edge centers (infrastructure & tools)
            'devops': { x: this.width * 0.5, y: this.height * 0.1 },      // Top-center
            'mobile': { x: this.width * 0.1, y: this.height * 0.5 },      // Left-center
            'tools': { x: this.width * 0.9, y: this.height * 0.5 },       // Right-center
            'python': { x: this.width * 0.5, y: this.height * 0.9 },      // Bottom-center

            // Inner ring (specialized categories)
            'monitoring': { x: this.width * 0.25, y: this.height * 0.25 },
            'testing': { x: this.width * 0.75, y: this.height * 0.25 },
            'security': { x: this.width * 0.25, y: this.height * 0.75 },
            'ui-ux': { x: this.width * 0.75, y: this.height * 0.75 },

            // Mid positions
            'api': { x: this.width * 0.35, y: this.height * 0.35 },
            'learning': { x: this.width * 0.65, y: this.height * 0.35 },
            'networking': { x: this.width * 0.35, y: this.height * 0.65 },
            'game-dev': { x: this.width * 0.65, y: this.height * 0.65 },

            // Special positions
            'mcp': { x: this.width * 0.5, y: this.height * 0.3 },
            'blockchain': { x: this.width * 0.5, y: this.height * 0.7 },

            // Center for uncategorized
            'other': { x: this.width * 0.5, y: this.height * 0.5 }
        };

        return positions[category] || positions['other'];
    }
    
    getNodeRadius(d) {
        // Enhanced radius calculation for better visibility
        const baseSize = Math.sqrt(d.stars || 1);
        return Math.max(5, Math.min(30, baseSize * 0.2 + 4));
    }
    
    setupFilters() {
        // Category filters
        const categoryContainer = document.getElementById('category-filters');
        if (categoryContainer) {
            const categories = ['all', ...Object.keys(this.categories)];
            
            categories.forEach(category => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn' + (category === 'all' ? ' active' : '');
                btn.textContent = category === 'all' ? 'All' : category.replace('-', ' ').toUpperCase();
                btn.dataset.category = category;
                btn.addEventListener('click', (e) => this.filterByCategory(category, e.target));
                categoryContainer.appendChild(btn);
            });
        }
        
        // Language filters - FIXED: Now includes Python and all languages
        const languageContainer = document.getElementById('language-filters');
        if (languageContainer) {
            // Get all unique languages with counts
            const languageCounts = new Map();
            this.repositories.forEach(repo => {
                if (repo.language && repo.language !== 'Unknown') {
                    languageCounts.set(repo.language, (languageCounts.get(repo.language) || 0) + 1);
                }
            });
            
            // Sort by count and take top languages
            const topLanguages = Array.from(languageCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 15)
                .map(([lang, count]) => lang);
            
            // All languages button
            const allBtn = document.createElement('button');
            allBtn.className = 'filter-btn active';
            allBtn.textContent = 'All';
            allBtn.dataset.language = 'all';
            allBtn.addEventListener('click', (e) => this.filterByLanguage('all', e.target));
            languageContainer.appendChild(allBtn);
            
            // Individual language buttons
            topLanguages.forEach(language => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                btn.textContent = language;
                btn.dataset.language = language;
                btn.addEventListener('click', (e) => this.filterByLanguage(language, e.target));
                languageContainer.appendChild(btn);
            });
        }
    }
    
    setupLegend() {
        const legendContainer = document.getElementById('legend-items');
        if (legendContainer) {
            const categoryCounts = {};
            
            // Count repositories per category
            this.repositories.forEach(repo => {
                categoryCounts[repo.category] = (categoryCounts[repo.category] || 0) + 1;
            });
            
            // Create legend items sorted by count
            Object.entries(categoryCounts)
                .sort(([,a], [,b]) => b - a)
                .forEach(([category, count]) => {
                    const item = document.createElement('div');
                    item.className = 'legend-item';
                    
                    const color = document.createElement('div');
                    color.className = 'legend-color';
                    color.style.backgroundColor = this.categoryColors[category] || '#6366F1';
                    
                    const label = document.createElement('span');
                    label.textContent = `${category.replace('-', ' ').toUpperCase()} (${count})`;
                    
                    item.appendChild(color);
                    item.appendChild(label);
                    
                    // Make legend items clickable to filter
                    item.addEventListener('click', () => {
                        this.filterByCategory(category);
                        // Update category filter button
                        document.querySelectorAll('#category-filters .filter-btn').forEach(btn => {
                            btn.classList.remove('active');
                            if (btn.dataset.category === category) {
                                btn.classList.add('active');
                            }
                        });
                    });
                    
                    item.style.cursor = 'pointer';
                    legendContainer.appendChild(item);
                });
        }
    }
    
    filterByCategory(category, button) {
        this.currentFilters.category = category;
        
        if (button) {
            document.querySelectorAll('#category-filters .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        }
        
        this.applyFilters();
    }
    
    filterByLanguage(language, button) {
        this.currentFilters.language = language;
        
        if (button) {
            document.querySelectorAll('#language-filters .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        }
        
        this.applyFilters();
    }
    
    applyFilters() {
        this.filteredRepositories = this.repositories.filter(repo => {
            // Search filter
            if (this.currentFilters.search) {
                const searchText = `${repo.name} ${repo.description} ${repo.language} ${repo.fullName}`.toLowerCase();
                if (!searchText.includes(this.currentFilters.search)) return false;
            }
            
            // Category filter
            if (this.currentFilters.category !== 'all' && repo.category !== this.currentFilters.category) {
                return false;
            }
            
            // Language filter
            if (this.currentFilters.language !== 'all' && repo.language !== this.currentFilters.language) {
                return false;
            }
            
            // Stars filter
            if (this.currentFilters.stars !== 'all') {
                const minStars = parseInt(this.currentFilters.stars);
                if (repo.stars < minStars) return false;
            }
            
            return true;
        });
        
        this.updateVisualization();
        this.updateStats();
    }
    
    updateVisualization() {
        if (!this.simulation || !this.svg) return;
        
        if (this.filteredRepositories.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Create intelligent links between repositories
        const links = this.createIntelligentLinks();
        
        const g = this.svg.select('.main-group');
        
        // Clear existing
        g.selectAll('*').remove();
        
        // Update links with enhanced styling
        const link = g.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('class', 'link')
            .attr('stroke', '#ffffff')
            .attr('stroke-opacity', 0.15)
            .attr('stroke-width', 1.5);
        
        // Update nodes with enhanced sizing and colors
        const node = g.append('g')
            .selectAll('circle')
            .data(this.filteredRepositories)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', d => this.getNodeRadius(d))
            .attr('fill', d => this.categoryColors[d.category] || '#6366F1')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2)
            .attr('opacity', 0.9)
            .call(this.createDragHandler())
            .on('click', (event, d) => {
                window.open(d.url, '_blank');
            })
            .on('mouseover', (event, d) => {
                this.showTooltip(event, d);
                // Highlight connected nodes
                d3.select(event.target)
                    .attr('stroke-width', 4)
                    .attr('opacity', 1);
            })
            .on('mouseout', (event, d) => {
                this.hideTooltip();
                d3.select(event.target)
                    .attr('stroke-width', 2)
                    .attr('opacity', 0.9);
            });
        
        // Add labels for popular repositories
        const label = g.append('g')
            .selectAll('text')
            .data(this.filteredRepositories.filter(d => d.stars > 30000))
            .enter().append('text')
            .attr('class', 'node-label')
            .text(d => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name)
            .attr('dy', '.35em')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', '#ffffff')
            .style('text-anchor', 'middle')
            .style('pointer-events', 'none')
            .style('text-shadow', '2px 2px 4px rgba(0,0,0,0.8)');
        
        // Update simulation
        this.simulation.nodes(this.filteredRepositories);
        this.simulation.force('link').links(links);
        this.simulation.alpha(0.6).restart();
        
        // Enhanced animation tick function
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
            
            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });
    }
    
    createIntelligentLinks() {
        const links = [];
        
        // Group repositories by category for better clustering
        const categoryGroups = d3.group(this.filteredRepositories, d => d.category);
        
        // Create links within categories (for clustering)
        categoryGroups.forEach(repos => {
            // Sort by stars to connect popular repos
            repos.sort((a, b) => b.stars - a.stars);
            
            for (let i = 0; i < repos.length && i < 20; i++) {
                for (let j = i + 1; j < Math.min(repos.length, i + 4); j++) {
                    if (Math.random() > 0.6) { // Add some randomness to avoid over-connection
                        links.push({
                            source: repos[i].id,
                            target: repos[j].id
                        });
                    }
                }
            }
        });
        
        // Add some cross-category links for popular repositories
        const popularRepos = this.filteredRepositories
            .filter(repo => repo.stars > 50000)
            .sort((a, b) => b.stars - a.stars)
            .slice(0, 10);
        
        for (let i = 0; i < popularRepos.length; i++) {
            for (let j = i + 1; j < popularRepos.length; j++) {
                if (Math.random() > 0.8) {
                    links.push({
                        source: popularRepos[i].id,
                        target: popularRepos[j].id
                    });
                }
            }
        }
        
        return links;
    }
    
    createDragHandler() {
        return d3.drag()
            .on('start', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }
    
    showTooltip(event, d) {
        const [x, y] = [event.pageX, event.pageY];
        const isMobile = window.innerWidth <= 767;
        const tooltipWidth = isMobile ? Math.min(window.innerWidth * 0.9, 350) : 350;
        const tooltipOffset = 15;

        // Calculate optimal position to keep tooltip in viewport
        let leftPos = x + tooltipOffset;
        let topPos = y - tooltipOffset;

        // Adjust horizontal position
        if (leftPos + tooltipWidth > window.innerWidth - 10) {
            // Position to the left of cursor if it would overflow right
            leftPos = Math.max(10, x - tooltipWidth - tooltipOffset);
        }

        // For mobile, center horizontally if near edges
        if (isMobile) {
            if (leftPos < 10 || leftPos + tooltipWidth > window.innerWidth - 10) {
                leftPos = (window.innerWidth - tooltipWidth) / 2;
            }
        }

        // Adjust vertical position to stay in viewport
        topPos = Math.max(10, Math.min(topPos, window.innerHeight - 200));

        this.tooltip
            .style('display', 'block')
            .style('left', leftPos + 'px')
            .style('top', topPos + 'px')
            .style('max-width', tooltipWidth + 'px')
            .html(`
                <div class=\"tooltip-title\">${d.name}</div>
                <div class=\"tooltip-owner\">by ${d.owner}</div>
                <div class=\"tooltip-category\">${d.category.replace('-', ' ').toUpperCase()}</div>
                <div class=\"tooltip-meta\">
                    <div class=\"tooltip-stat\">⭐ ${d.stars.toLocaleString()}</div>
                    <div class=\"tooltip-stat\">🍴 ${d.forks.toLocaleString()}</div>
                    <div class=\"tooltip-stat\">💻 ${d.language}</div>
                    <div class=\"tooltip-stat\">🔗 ${d.fullName}</div>
                </div>
                <div class=\"tooltip-desc\">${d.description || 'No description available'}</div>
                <div class=\"tooltip-action\">👆 Click to open repository</div>
            `);
    }
    
    hideTooltip() {
        this.tooltip.style('display', 'none');
    }
    
    showEmptyState() {
        const g = this.svg.select('.main-group');
        g.selectAll('*').remove();
        g.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffffff')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .text('No repositories match your current filters');
        
        g.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2 + 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffffff')
            .attr('font-size', '14px')
            .text('Try adjusting your search criteria or reset filters');
    }
    
    updateStats() {
        document.getElementById('total-repos').textContent = this.repositories.length;
        document.getElementById('visible-repos').textContent = this.filteredRepositories.length;
        const updatedEl = document.getElementById('last-updated');
        const ts = this.dataLastUpdated ? new Date(this.dataLastUpdated) : new Date();
        updatedEl.textContent = ts.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        // data source note
        const noteEl = document.getElementById('data-source-note');
        if (noteEl) {
            noteEl.textContent = this.dataSource === 'live' ? 'Live (API)' : 'Cached (Actions)';
        }
    }
    
    resetFilters() {
        // Reset all filters
        this.currentFilters = {
            search: '',
            category: 'all',
            language: 'all',
            stars: 'all'
        };
        
        // Reset UI elements
        const searchInput = document.getElementById('search');
        if (searchInput) searchInput.value = '';
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Activate 'all' buttons
        document.querySelectorAll('[data-category=\"all\"], [data-language=\"all\"], [data-stars=\"all\"]').forEach(btn => {
            btn.classList.add('active');
        });
        
        this.applyFilters();
    }
    
    handleResize() {
        if (!this.svg || !this.simulation) return;
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.svg.attr('width', this.width).attr('height', this.height);
        this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
        this.simulation.alpha(0.3).restart();
    }
    
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    showError(message) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div class=\"error-message\">
                    <h3>⚠️ Error</h3>
                    <p>${message}</p>
                    <button onclick=\"location.reload()\" class=\"filter-btn\" style=\"margin-top: 15px; background: #EF4444;\">
                        🔄 Retry
                    </button>
                </div>
            `;
        }
    }
}

// Initialize the application when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GitHubStarsGraph();
    });
} else {
    new GitHubStarsGraph();
}
