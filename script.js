// Global variables
let allRepos = [];
let filteredRepos = [];
let simulation;
let svg;
let tooltip;
let searchInput;
let categoryColors = {};
let languageColors = {};
const categories = {
    'ai-ml': ['ai', 'machine learning', 'ml', 'deep learning', 'neural', 'llm', 'gpt', 'openai', 'anthropic', 'langchain', 'tensorflow', 'pytorch', 'huggingface', 'transformer', 'agent', 'rag', 'vector'],
    'web-dev': ['react', 'next', 'vue', 'angular', 'svelte', 'web', 'frontend', 'backend', 'fullstack', 'css', 'html', 'tailwind', 'bootstrap'],
    'mobile': ['react-native', 'flutter', 'ios', 'android', 'mobile', 'expo', 'swift', 'kotlin'],
    'devops': ['docker', 'kubernetes', 'ci/cd', 'deployment', 'infrastructure', 'terraform', 'ansible', 'jenkins', 'github actions'],
    'data': ['data', 'analytics', 'database', 'sql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'spark', 'pandas'],
    'tools': ['cli', 'editor', 'ide', 'extension', 'utility', 'productivity', 'automation', 'terminal'],
    'security': ['security', 'auth', 'encryption', 'privacy', 'vulnerability', 'oauth', 'jwt'],
    'api': ['api', 'rest', 'graphql', 'sdk', 'client', 'server', 'microservice'],
    'learning': ['tutorial', 'course', 'learning', 'education', 'examples', 'book', 'guide', 'documentation'],
    'ui-ux': ['ui', 'ux', 'design', 'component', 'library', 'theme', 'icon', 'animation'],
    'blockchain': ['blockchain', 'crypto', 'ethereum', 'bitcoin', 'web3', 'solidity', 'nft'],
    'game-dev': ['game', 'unity', 'unreal', 'godot', 'engine', 'graphics', '3d'],
    'other': []
};

// Initialize the application
async function init() {
    try {
        tooltip = d3.select('#tooltip');
        searchInput = d3.select('#search');
        
        // Set up search functionality
        searchInput.on('input', handleSearch);
        
        // Load repositories
        await loadRepositories();
        
        // Setup graph
        setupGraph();
        
        // Hide loading
        d3.select('#loading').style('display', 'none');
        
    } catch (error) {
        console.error('Error initializing app:', error);
        d3.select('#loading').html(`<p>Error loading data: ${error.message}</p>`);
    }
}

// Load repositories from GitHub API
async function loadRepositories() {
    const username = 'niranjanxprt'; // Your GitHub username
    let page = 1;
    const perPage = 100;
    allRepos = [];
    
    try {
        while (true) {
            const response = await fetch(`https://api.github.com/users/${username}/starred?per_page=${perPage}&page=${page}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch repositories: ${response.statusText}`);
            }
            
            const repos = await response.json();
            
            if (repos.length === 0) break;
            
            allRepos = allRepos.concat(repos.map(repo => ({
                id: repo.id,
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description || 'No description available',
                url: repo.html_url,
                language: repo.language || 'Unknown',
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                updatedAt: new Date(repo.updated_at),
                topics: repo.topics || [],
                category: categorizeRepo(repo)
            })));
            
            page++;
        }
        
        filteredRepos = [...allRepos];
        
        // Update stats
        d3.select('#total-repos').text(allRepos.length);
        d3.select('#visible-repos').text(filteredRepos.length);
        d3.select('#last-updated').text(new Date().toLocaleDateString());
        
        // Setup filters
        setupFilters();
        
    } catch (error) {
        console.error('Error loading repositories:', error);
        throw error;
    }
}

// Categorize repository based on name, description, and topics
function categorizeRepo(repo) {
    const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
        if (category === 'other') continue;
        
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    
    return 'other';
}

// Setup filter buttons
function setupFilters() {
    // Category filters
    const categoryFilter = d3.select('#category-filters');
    const categoryNames = Object.keys(categories);
    
    categoryFilter.selectAll('.filter-btn')
        .data(['all', ...categoryNames])
        .enter()
        .append('button')
        .attr('class', 'filter-btn')
        .classed('active', d => d === 'all')
        .text(d => d === 'all' ? 'All' : d.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))
        .on('click', function(event, d) {
            d3.selectAll('#category-filters .filter-btn').classed('active', false);
            d3.select(this).classed('active', true);
            filterByCategory(d);
        });
    
    // Language filters
    const languages = [...new Set(allRepos.map(r => r.language))].sort();
    const languageFilter = d3.select('#language-filters');
    
    languageFilter.selectAll('.filter-btn')
        .data(['all', ...languages.slice(0, 10)]) // Show top 10 languages
        .enter()
        .append('button')
        .attr('class', 'filter-btn')
        .classed('active', d => d === 'all')
        .text(d => d === 'all' ? 'All' : d)
        .on('click', function(event, d) {
            d3.selectAll('#language-filters .filter-btn').classed('active', false);
            d3.select(this).classed('active', true);
            filterByLanguage(d);
        });
    
    // Setup colors
    setupColors();
}

// Setup color schemes
function setupColors() {
    const categoryList = Object.keys(categories);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10.concat(d3.schemeSet3));
    
    categoryList.forEach((category, i) => {
        categoryColors[category] = colorScale(i);
    });
    
    // Setup legend
    const legend = d3.select('#legend-items');
    legend.selectAll('.legend-item')
        .data(categoryList)
        .enter()
        .append('div')
        .attr('class', 'legend-item')
        .html(d => `
            <div class="legend-color" style="background-color: ${categoryColors[d]}"></div>
            <span>${d.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
        `);
}

// Filter functions
function filterByCategory(category) {
    if (category === 'all') {
        filteredRepos = [...allRepos];
    } else {
        filteredRepos = allRepos.filter(repo => repo.category === category);
    }
    updateGraph();
}

function filterByLanguage(language) {
    if (language === 'all') {
        filteredRepos = [...allRepos];
    } else {
        filteredRepos = allRepos.filter(repo => repo.language === language);
    }
    updateGraph();
}

function handleSearch() {
    const query = searchInput.property('value').toLowerCase();
    
    if (!query) {
        filteredRepos = [...allRepos];
    } else {
        filteredRepos = allRepos.filter(repo => 
            repo.name.toLowerCase().includes(query) ||
            repo.description.toLowerCase().includes(query) ||
            repo.language.toLowerCase().includes(query) ||
            repo.fullName.toLowerCase().includes(query)
        );
    }
    
    updateGraph();
}

// Setup the D3.js force-directed graph
function setupGraph() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    svg = d3.select('#graph')
        .attr('width', width)
        .attr('height', height);
    
    // Clear existing content
    svg.selectAll('*').remove();
    
    // Create zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            svg.selectAll('g').attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Create main group
    const g = svg.append('g');
    
    // Create simulation
    simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30));
    
    updateGraph();
}

// Update the graph with current filtered data
function updateGraph() {
    if (!simulation || !svg) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Create links between repos of same category
    const links = [];
    const categoryGroups = d3.group(filteredRepos, d => d.category);
    
    categoryGroups.forEach(repos => {
        for (let i = 0; i < repos.length; i++) {
            for (let j = i + 1; j < Math.min(repos.length, i + 4); j++) {
                links.push({
                    source: repos[i].id,
                    target: repos[j].id
                });
            }
        }
    });
    
    const g = svg.select('g');
    
    // Update links
    const link = g.selectAll('.link')
        .data(links, d => `${d.source}-${d.target}`);
    
    link.exit().remove();
    
    link.enter()
        .append('line')
        .attr('class', 'link');
    
    // Update nodes
    const node = g.selectAll('.node')
        .data(filteredRepos, d => d.id);
    
    node.exit().remove();
    
    const nodeEnter = node.enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', d => Math.sqrt(d.stars) * 0.5 + 5)
        .attr('fill', d => categoryColors[d.category] || '#999')
        .attr('stroke', '#fff')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
        .on('click', (event, d) => {
            window.open(d.url, '_blank');
        })
        .on('mouseover', (event, d) => {
            showTooltip(event, d);
        })
        .on('mouseout', hideTooltip);
    
    // Update labels
    const label = g.selectAll('.node-label')
        .data(filteredRepos, d => d.id);
    
    label.exit().remove();
    
    label.enter()
        .append('text')
        .attr('class', 'node-label')
        .text(d => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name);
    
    // Update simulation
    simulation.nodes(filteredRepos);
    simulation.force('link').links(links);
    
    simulation.alpha(1).restart();
    
    simulation.on('tick', () => {
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
            .attr('y', d => d.y + 4);
    });
    
    // Update stats
    d3.select('#visible-repos').text(filteredRepos.length);
}

// Drag functions
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Tooltip functions
function showTooltip(event, d) {
    const [x, y] = d3.pointer(event, document.body);
    
    tooltip
        .style('display', 'block')
        .style('left', (x + 10) + 'px')
        .style('top', (y - 10) + 'px')
        .html(`
            <h4>${d.name}</h4>
            <p><strong>Language:</strong> ${d.language}</p>
            <p><strong>Stars:</strong> ${d.stars.toLocaleString()}</p>
            <p><strong>Forks:</strong> ${d.forks.toLocaleString()}</p>
            <p><strong>Category:</strong> ${d.category.replace('-', ' ')}</p>
            <p><strong>Description:</strong> ${d.description}</p>
            <p><small>Click to open repository</small></p>
        `);
}

function hideTooltip() {
    tooltip.style('display', 'none');
}

// Handle window resize
window.addEventListener('resize', () => {
    if (!svg || !simulation) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    svg.attr('width', width).attr('height', height);
    simulation.force('center', d3.forceCenter(width / 2, height / 2));
    simulation.alpha(1).restart();
});

// Initialize the app when the page loads
window.addEventListener('load', init);