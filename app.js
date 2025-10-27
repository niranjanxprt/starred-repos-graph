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
        
        // Enhanced category definitions with comprehensive keywords
        this.categories = {
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
        
        // Enhanced color scheme with better contrast and clustering
        this.categoryColors = {
            'ai-ml': '#8B5CF6',      // Purple - prominent for AI
            'web-dev': '#10B981',    // Emerald - fresh for web
            'python': '#F59E0B',     // Amber - Python's signature color
            'data': '#3B82F6',       // Blue - data ocean
            'tools': '#6B7280',      // Gray - utility
            'mobile': '#EF4444',     // Red - mobile energy
            'learning': '#84CC16',   // Lime - growth
            'devops': '#06B6D4',     // Cyan - infrastructure
            'ui-ux': '#EC4899',      // Pink - design
            'api': '#9333EA',        // Violet - connections
            'game-dev': '#F97316',   // Orange - gaming fun
            'security': '#DC2626',   // Dark red - security
            'mcp': '#A855F7',        // Purple variant - special
            'blockchain': '#F59E0B', // Gold - crypto
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
            'ai-ml': { x: this.width * 0.2, y: this.height * 0.2 },     // Top-left
            'web-dev': { x: this.width * 0.8, y: this.height * 0.2 },   // Top-right
            'python': { x: this.width * 0.2, y: this.height * 0.8 },    // Bottom-left
            'data': { x: this.width * 0.8, y: this.height * 0.8 },      // Bottom-right
            'tools': { x: this.width * 0.5, y: this.height * 0.1 },     // Top-center
            'mobile': { x: this.width * 0.1, y: this.height * 0.5 },    // Left-center
            'learning': { x: this.width * 0.9, y: this.height * 0.5 },  // Right-center
            'devops': { x: this.width * 0.5, y: this.height * 0.9 },    // Bottom-center
            'ui-ux': { x: this.width * 0.3, y: this.height * 0.3 },     // Inner positions
            'api': { x: this.width * 0.7, y: this.height * 0.3 },
            'security': { x: this.width * 0.3, y: this.height * 0.7 },
            'game-dev': { x: this.width * 0.7, y: this.height * 0.7 },
            'mcp': { x: this.width * 0.5, y: this.height * 0.4 },
            'blockchain': { x: this.width * 0.6, y: this.height * 0.6 },
            'other': { x: this.width * 0.5, y: this.height * 0.5 }       // Center
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
