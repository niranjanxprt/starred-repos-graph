// GitHub Stars Graph Visualization - Complete Implementation
class GitHubStarsGraph {
    constructor() {
        this.repositories = [];
        this.filteredRepositories = [];
        this.simulation = null;
        this.svg = null;
        this.tooltip = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Category definitions with comprehensive keywords
        this.categories = {
            'ai-ml': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural', 'llm', 'gpt', 'openai', 'anthropic', 'langchain', 'tensorflow', 'pytorch', 'huggingface', 'transformer', 'agent', 'rag', 'vector', 'claude', 'gemini', 'chatgpt', 'llama', 'bert', 'embedding', 'semantic'],
            'web-dev': ['react', 'next', 'nextjs', 'vue', 'vuejs', 'angular', 'svelte', 'web', 'frontend', 'backend', 'fullstack', 'css', 'html', 'tailwind', 'bootstrap', 'javascript', 'typescript', 'node', 'nodejs', 'express', 'fastapi', 'django', 'flask'],
            'mobile': ['react-native', 'flutter', 'ios', 'android', 'mobile', 'expo', 'swift', 'kotlin', 'xamarin', 'ionic', 'cordova', 'phonegap', 'native', 'app'],
            'devops': ['docker', 'kubernetes', 'k8s', 'ci/cd', 'deployment', 'infrastructure', 'terraform', 'ansible', 'jenkins', 'helm', 'argo', 'flux', 'monitoring', 'prometheus', 'grafana', 'deployment', 'ops'],
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
        
        // Enhanced color scheme with better contrast
        this.categoryColors = {
            'ai-ml': '#8B5CF6',
            'web-dev': '#10B981',
            'mobile': '#EF4444',
            'devops': '#F59E0B',
            'data': '#3B82F6',
            'tools': '#6B7280',
            'security': '#DC2626',
            'api': '#9333EA',
            'learning': '#84CC16',
            'ui-ux': '#EC4899',
            'blockchain': '#F97316',
            'game-dev': '#A855F7',
            'mcp': '#06B6D4',
            'python': '#FBBF24',
            'other': '#6366F1'
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
        searchInput.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
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
    }
    
    async loadRepositories() {
        const username = 'niranjanxprt';
        let totalLoaded = 0;
        
        try {
            // Update progress
            this.updateProgress('Connecting to GitHub API...');
            
            // Try to load from data file first (if GitHub Actions has run)
            try {
                const response = await fetch('./data/repositories.json');
                if (response.ok) {
                    const data = await response.json();
                    this.repositories = data.repositories || [];
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
                    totalLoaded = this.repositories.length;
                    
                    this.updateProgress(`Loading repositories... ${totalLoaded} found`);
                    
                    page++;
                    
                    // Small delay to be nice to GitHub API
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                } catch (error) {
                    console.error(`Error fetching page ${page}:`, error);
                    if (this.repositories.length === 0) {
                        throw error; // Re-throw if we have no data
                    }
                    break; // Continue with partial data
                }
            }
            
            console.log(`Successfully loaded ${this.repositories.length} repositories`);
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading repositories:', error);
            
            // Show error but try to continue with sample data for demo
            this.showError(`Error loading data: ${error.message}. Showing sample data.`);
            
            // Use sample data for demonstration
            this.repositories = this.generateSampleData();
            this.updateStats();
        }
    }
    
    generateSampleData() {
        // Sample data representing your actual starred repositories
        return [
            {
                id: 669879380,
                name: "LLMs-from-scratch",
                owner: "rasbt",
                fullName: "rasbt/LLMs-from-scratch",
                description: "Implement a ChatGPT-like LLM in PyTorch from scratch, step by step",
                url: "https://github.com/rasbt/LLMs-from-scratch",
                language: "Jupyter Notebook",
                stars: 73565,
                forks: 10699,
                category: "ai-ml"
            },
            {
                id: 28457823,
                name: "freeCodeCamp",
                owner: "freeCodeCamp",
                fullName: "freeCodeCamp/freeCodeCamp",
                description: "freeCodeCamp.org's open-source codebase and curriculum",
                url: "https://github.com/freeCodeCamp/freeCodeCamp",
                language: "TypeScript",
                stars: 429300,
                forks: 41811,
                category: "learning"
            },
            {
                id: 507775,
                name: "elasticsearch",
                owner: "elastic",
                fullName: "elastic/elasticsearch",
                description: "Free and Open Source, Distributed, RESTful Search Engine",
                url: "https://github.com/elastic/elasticsearch",
                language: "Java",
                stars: 74858,
                forks: 25515,
                category: "data"
            },
            // Add more sample data representing different categories
            ...this.generateAdditionalSampleData()
        ];
    }
    
    generateAdditionalSampleData() {
        const sampleRepos = [];
        const categories = Object.keys(this.categories).filter(c => c !== 'other');
        const languages = ['JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'Swift', 'Kotlin', 'Ruby', 'PHP', 'C#'];
        
        // Generate representative sample data
        for (let i = 0; i < 50; i++) {
            const category = categories[i % categories.length];
            const language = languages[i % languages.length];
            const baseStars = Math.floor(Math.random() * 50000) + 100;
            
            sampleRepos.push({
                id: 2000000 + i,
                name: `sample-repo-${i + 1}`,
                owner: `user${i + 1}`,
                fullName: `user${i + 1}/sample-repo-${i + 1}`,
                description: `Sample ${category.replace('-', ' ')} repository for demonstration`,
                url: `https://github.com/user${i + 1}/sample-repo-${i + 1}`,
                language: language,
                stars: baseStars,
                forks: Math.floor(baseStars * 0.1),
                category: category,
                updatedAt: new Date().toISOString()
            });
        }
        
        return sampleRepos;
    }
    
    updateProgress(message) {
        const progressText = document.getElementById('progress-text');
        if (progressText) {
            progressText.textContent = message;
        }
    }
    
    categorizeRepo(repo) {
        const text = `${repo.name || ''} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
        const repoLanguage = (repo.language || '').toLowerCase();
        
        // Special handling for Python repositories
        if (repoLanguage === 'python' && 
            (text.includes('python') || text.includes('django') || text.includes('flask'))) {
            return 'python';
        }
        
        // Check each category
        for (const [category, keywords] of Object.entries(this.categories)) {
            if (category === 'other') continue;
            
            if (keywords.some(keyword => text.includes(keyword))) {
                return category;
            }
        }
        
        return 'other';
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
        
        // Setup force simulation
        this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.id).distance(60))
            .force('charge', d3.forceManyBody().strength(-150))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(d => this.getNodeRadius(d) + 2));
        
        this.filteredRepositories = [...this.repositories];
        this.updateVisualization();
    }
    
    getNodeRadius(d) {
        // Size nodes based on star count, with reasonable min/max
        const baseSize = Math.sqrt(d.stars || 1);
        return Math.max(4, Math.min(25, baseSize * 0.15 + 3));
    }
    
    setupFilters() {
        // Category filters
        const categoryContainer = document.getElementById('category-filters');
        const categories = ['all', ...Object.keys(this.categories)];
        
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn' + (category === 'all' ? ' active' : '');
            btn.textContent = category === 'all' ? 'All' : category.replace('-', ' ').toUpperCase();
            btn.dataset.category = category;
            btn.addEventListener('click', (e) => this.filterByCategory(category, e.target));
            categoryContainer.appendChild(btn);
        });
        
        // Language filters
        const languages = [...new Set(this.repositories.map(r => r.language))]
            .filter(lang => lang && lang !== 'Unknown')
            .sort()
            .slice(0, 15); // Top 15 languages
        
        const languageContainer = document.getElementById('language-filters');
        
        // All languages button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.textContent = 'All';
        allBtn.dataset.language = 'all';
        allBtn.addEventListener('click', (e) => this.filterByLanguage('all', e.target));
        languageContainer.appendChild(allBtn);
        
        // Individual language buttons
        languages.forEach(language => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = language;
            btn.dataset.language = language;
            btn.addEventListener('click', (e) => this.filterByLanguage(language, e.target));
            languageContainer.appendChild(btn);
        });
    }
    
    setupLegend() {
        const legendContainer = document.getElementById('legend-items');
        const categoryCounts = {};
        
        // Count repositories per category
        this.repositories.forEach(repo => {
            categoryCounts[repo.category] = (categoryCounts[repo.category] || 0) + 1;
        });
        
        // Create legend items
        Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a) // Sort by count, descending
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
                
                legendContainer.appendChild(item);
            });
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
        
        // Create intelligent links between repositories
        const links = this.createIntelligentLinks();
        
        const g = this.svg.select('.main-group');
        
        // Update links
        const link = g.selectAll('.link')
            .data(links, d => `${d.source.id || d.source}-${d.target.id || d.target}`);
        
        link.exit().remove();
        
        link.enter()
            .append('line')
            .attr('class', 'link');
        
        // Update nodes
        const node = g.selectAll('.node')
            .data(this.filteredRepositories, d => d.id);
        
        node.exit().remove();
        
        const nodeEnter = node.enter()
            .append('circle')
            .attr('class', 'node')
            .attr('r', d => this.getNodeRadius(d))
            .attr('fill', d => this.categoryColors[d.category] || '#6366F1')
            .call(this.createDragHandler())
            .on('click', (event, d) => {
                window.open(d.url, '_blank');
            })
            .on('mouseover', (event, d) => {
                this.showTooltip(event, d);
            })
            .on('mouseout', () => {
                this.hideTooltip();
            });
        
        // Update labels for popular repositories
        const label = g.selectAll('.node-label')
            .data(this.filteredRepositories.filter(d => d.stars > 30000), d => d.id);
        
        label.exit().remove();
        
        label.enter()
            .append('text')
            .attr('class', 'node-label')
            .text(d => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name)
            .attr('dy', '.35em');
        
        // Update simulation
        this.simulation.nodes(this.filteredRepositories);
        this.simulation.force('link').links(links);
        this.simulation.alpha(0.5).restart();
        
        // Animation tick function
        this.simulation.on('tick', () => {
            g.selectAll('.link')
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            g.selectAll('.node')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
            
            g.selectAll('.node-label')
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });
    }
    
    createIntelligentLinks() {
        const links = [];
        
        // Group repositories by category
        const categoryGroups = d3.group(this.filteredRepositories, d => d.category);
        
        // Create links within categories
        categoryGroups.forEach(repos => {
            // Sort by stars to connect popular repos
            repos.sort((a, b) => b.stars - a.stars);
            
            for (let i = 0; i < repos.length && i < 20; i++) { // Limit connections to avoid clutter
                for (let j = i + 1; j < Math.min(repos.length, i + 4); j++) {
                    links.push({
                        source: repos[i].id,
                        target: repos[j].id
                    });
                }
            }
        });
        
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
        
        this.tooltip
            .style('display', 'block')
            .style('left', Math.min(x + 15, window.innerWidth - 370) + 'px')
            .style('top', Math.max(y - 15, 10) + 'px')
            .html(`
                <div class="tooltip-title">${d.name}</div>
                <div class="tooltip-owner">by ${d.owner}</div>
                <div class="tooltip-category">${d.category.replace('-', ' ').toUpperCase()}</div>
                <div class="tooltip-meta">
                    <div class="tooltip-stat">⭐ ${d.stars.toLocaleString()}</div>
                    <div class="tooltip-stat">🍴 ${d.forks.toLocaleString()}</div>
                    <div class="tooltip-stat">💻 ${d.language}</div>
                    <div class="tooltip-stat">🔗 ${d.fullName}</div>
                </div>
                <div class="tooltip-desc">${d.description || 'No description available'}</div>
                <div class="tooltip-action">👆 Click to open repository</div>
            `);
    }
    
    hideTooltip() {
        this.tooltip.style('display', 'none');
    }
    
    updateStats() {
        document.getElementById('total-repos').textContent = this.repositories.length;
        document.getElementById('visible-repos').textContent = this.filteredRepositories.length;
        document.getElementById('last-updated').textContent = new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
        document.getElementById('search').value = '';
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector('[data-category="all"]').classList.add('active');
        document.querySelector('[data-language="all"]').classList.add('active');
        document.querySelector('[data-stars="all"]').classList.add('active');
        
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
        loading.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="filter-btn" style="margin-top: 15px; background: #EF4444;">
                    🔄 Retry
                </button>
            </div>
        `;
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