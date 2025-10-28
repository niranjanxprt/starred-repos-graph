# 🌟 GitHub Stars Graph Visualization

> **Interactive force-directed graph of ALL your GitHub starred repositories with intelligent categorization, mobile-responsive design, and automatic updates**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-View%20App-blue?style=for-the-badge&logo=github)](https://niranjanxprt.github.io/starred-repos-graph/)
[![Auto Update](https://img.shields.io/badge/🔄%20Auto%20Update-Every%206%20Hours-green?style=for-the-badge)](https://github.com/niranjanxprt/starred-repos-graph/actions)
[![Repositories](https://img.shields.io/badge/📦%20Repositories-958%2B-orange?style=for-the-badge)](https://github.com/niranjanxprt?tab=stars)
[![GitHub Pages](https://img.shields.io/badge/🌐%20GitHub%20Pages-Live-success?style=for-the-badge)](https://niranjanxprt.github.io/starred-repos-graph/)

## 🎯 **Live Application**

**🔗 [https://niranjanxprt.github.io/starred-repos-graph/](https://niranjanxprt.github.io/starred-repos-graph/)**

*Click above to explore an interactive visualization of 958+ starred repositories with intelligent clustering, advanced filtering, mobile-responsive design, and real-time updates!*

---

## ✨ **Key Features**

### 🎨 **Interactive Graph Visualization**
- **Force-directed network graph** showing all 958+ starred repositories as connected nodes
- **Intelligent clustering** with strategic positioning across 19 categories
- **Dark professional theme** optimized for long viewing sessions
- **Click any node** to instantly open the repository in GitHub
- **Drag nodes** around to explore relationships and reorganize
- **Zoom and pan** for detailed exploration of different areas
- **Smart connections** between related repositories within and across categories

### 🧠 **Intelligent Categorization System**

Powered by **advanced weighted scoring algorithm** that analyzes repository names, descriptions, topics, and programming languages:

| Category | Count | Color | Description |
|----------|-------|-------|-------------|
| 🤖 **AI/ML** | 247 (25.8%) | Purple | Machine Learning, LLMs, Transformers, Neural Networks |
| 🐍 **Python** | 112 (11.7%) | Yellow | Django, Flask, FastAPI, Data Science Tools |
| 🌐 **Web Dev** | 91 (9.5%) | Emerald | React, Next.js, Vue, Angular, Full-stack |
| 📚 **Learning** | 41 (4.3%) | Green | Tutorials, Courses, Educational Resources |
| 🚀 **DevOps** | 35 (3.7%) | Cyan | Docker, Kubernetes, CI/CD, GitOps |
| ☁️ **Cloud** | 31 (3.2%) | Amber | AWS, Azure, GCP, Infrastructure-as-Code |
| 📊 **Data** | 25 (2.6%) | Blue | Databases, ETL, Data Engineering |
| 🔧 **MCP** | 23 (2.4%) | Purple | Model Context Protocol, Claude Desktop |
| 🎨 **UI/UX** | 23 (2.4%) | Pink | Design Systems, Components, Animations |
| 🛠️ **Tools** | 22 (2.3%) | Gray | CLI Tools, IDEs, Productivity Apps |
| 📱 **Mobile** | 22 (2.3%) | Red | React Native, Flutter, iOS/Android |
| 🔒 **Security** | 18 (1.9%) | Dark Red | Authentication, Encryption, OAuth |
| 🔗 **API** | 10 (1.0%) | Violet | REST, GraphQL, SDKs, Microservices |
| 📡 **Monitoring** | 5 (0.5%) | Orange | Prometheus, Grafana, Observability |
| 🌐 **Networking** | 5 (0.5%) | Sky Blue | Network Programming, Protocols |
| 🎮 **Game Dev** | 4 (0.4%) | Orange | Unity, Unreal, Game Engines |
| 🧪 **Testing** | 4 (0.4%) | Lime | Jest, Pytest, Cypress, Test Automation |
| ₿ **Blockchain** | 3 (0.3%) | Gold | Ethereum, Web3, Smart Contracts |
| ⚙️ **Other** | 237 (24.7%) | Indigo | Uncategorized & Specialized |

**Intelligent Scoring Features:**
- **Word boundary matching**: Prevents false positives (e.g., "app" won't match "application")
- **Multi-factor analysis**: Considers name, description, topics, and programming language
- **Weighted keywords**: Strong (10pts), Medium (5pts), Weak (2pts) indicators
- **Topic bonuses**: Extra points for GitHub's curated topic tags
- **Language boosts**: Automatic scoring based on primary programming language
- **Special case handling**: Kubernetes+examples prioritizes DevOps over Learning

### 🔍 **Advanced Filtering & Search**
- **Real-time search** by repository name, description, owner, or language
- **Category filtering** - click legend items or category buttons to focus
- **Language filtering** - filter by programming language
- **Star count filtering** - view only popular repositories (1K+, 5K+, 10K+, 50K+)
- **Visual feedback** - filtered results update graph in real-time
- **Reset functionality** - clear all filters with Escape key

### 📱 **Mobile-Responsive Design**

Fully optimized for mobile devices with:
- **Collapsible navigation panels** with hamburger-style toggles
- **Touch-friendly controls** with 44px minimum tap targets
- **Smart tooltip positioning** that adapts to viewport
- **Landscape orientation support** with optimized layouts
- **Responsive breakpoints**:
  - Small phones (< 480px)
  - Phones/tablets (480-767px)
  - Tablets (768-1023px)
  - Desktop (1024px+)
- **Gesture support**: Pinch-to-zoom, swipe, drag interactions
- **Slide-in panels** that don't block the graph view

### 🔄 **Fully Automated Updates**
- **GitHub Actions workflow** runs every 6 hours automatically
- **Fetches ALL starred repositories** via GitHub API with pagination
- **Intelligent categorization** using advanced weighted scoring
- **Auto-deployment** to GitHub Pages after each update
- **Commit tracking** - see update history in repository commits
- **Zero maintenance** - completely hands-off operation

---

## 🎮 **How to Use the App**

### 🖥️ **Desktop Controls**
1. **Zoom**: Mouse wheel or trackpad pinch to zoom in/out
2. **Pan**: Click and drag empty space to move around the graph
3. **Drag Nodes**: Click and drag individual repositories to reposition
4. **Click to Open**: Click any node to open the repository in GitHub
5. **Keyboard Shortcuts**: Press `Escape` to reset all filters

### 📱 **Mobile Controls**
1. **Open Filters**: Tap the ⚙️ button (bottom-left) for search and filters
2. **Open Legend**: Tap the 🎨 button (bottom-left) for category legend
3. **Close Panels**: Tap ✕ button or tap outside the panel
4. **Touch Gestures**: Pinch to zoom, drag to pan, tap nodes to open
5. **Landscape Mode**: Rotate device for optimized horizontal layout

### 🔍 **Filtering & Search**
1. **Search Bar**: Type to find repositories by name, description, or language
2. **Category Buttons**: Click category filters or legend items to focus
3. **Language Filter**: Filter by programming language
4. **Star Filters**: Show only popular repositories with minimum star counts
5. **Reset**: Press `Escape` key or use reset button to clear all filters

### 📊 **Understanding the Visualization**
- **Node Size**: Larger nodes = more popular repositories (higher star count)
- **Node Color**: Each color represents a different category (see legend)
- **Connections**: Lines connect related repositories (same category/language)
- **Positioning**: Force-directed physics groups similar repositories together
- **Clusters**: Categories are positioned strategically for better organization

---

## 🛠️ **Technical Architecture**

### 📁 **Project Structure**
```
starred-repos-graph/
├── index.html              # Main application interface with mobile-responsive CSS
├── app.js                  # Core D3.js visualization with intelligent categorization
├── scripts/
│   ├── fetch-data.js      # Backend data fetcher with scoring algorithm
│   └── clean-data.js      # Data quality validation and cleanup
├── data/
│   ├── repositories.json  # Auto-generated repository dataset (958+ repos)
│   └── summary.json       # Category and language statistics
├── .github/workflows/
│   └── update-data.yml    # Scheduled automation (every 6 hours)
└── README.md              # Documentation
```

### 💻 **Technology Stack**
- **Frontend**: Vanilla JavaScript + D3.js v7 (no frameworks needed)
- **Visualization**: D3.js force-directed graph with custom physics simulation
- **Styling**: Modern CSS with dark theme and mobile-responsive breakpoints
- **Data Source**: GitHub API (real-time repository data with pagination)
- **Automation**: GitHub Actions (scheduled data updates every 6 hours)
- **Deployment**: GitHub Pages (automatic deployment pipeline)
- **Storage**: JSON files (version-controlled repository data)

### 🧮 **Algorithm Details**

**Categorization System:**
- **Weighted Scoring**: Strong keywords (10pts), Medium (5pts), Weak (2pts)
- **Word Boundary Matching**: Uses regex `\b` to prevent false positives
- **Topic Bonuses**: +3-5 points for matching GitHub topics
- **Language Boosts**: +3-10 points based on programming language
- **Minimum Threshold**: Requires 5+ points to categorize
- **Special Cases**: Custom rules for edge cases (e.g., kubernetes+examples)

**Physics Simulation:**
- Custom force simulation with collision detection
- Category-based gravitational attraction for clustering
- Strategic positioning across 19 category locations
- Optimized for 958+ repositories with efficient rendering

---

## 📊 **Repository Statistics**

### 📈 **Current Numbers**
- **Total Repositories**: 958+ (automatically counted)
- **Programming Languages**: 30+ (JavaScript, Python, TypeScript, Java, Go, Rust, etc.)
- **Categories**: 19 intelligent auto-categories (including Cloud, Monitoring, Testing, Networking)
- **Update Frequency**: Every 6 hours via GitHub Actions
- **Data Freshness**: Always current with your latest stars
- **Most Popular Category**: AI/ML (247 repositories, 25.8%)
- **Fastest Growing**: Cloud infrastructure and DevOps tools

### 🏆 **Top Categories by Repository Count**
1. 🤖 **AI/ML**: 247 repositories (25.8%)
2. ⚙️ **Other**: 237 repositories (24.7%)
3. 🐍 **Python**: 112 repositories (11.7%)
4. 🌐 **Web Development**: 91 repositories (9.5%)
5. 📚 **Learning**: 41 repositories (4.3%)

---

## 🚀 **Setup & Configuration**

### 🎯 **Quick Setup (For Your Own Stars)**

1. **Fork this repository**
2. **Update username** in `.github/workflows/update-data.yml`:
   ```yaml
   GITHUB_USERNAME: 'YOUR-GITHUB-USERNAME'  # Change this line
   ```
3. **Update username** in `scripts/fetch-data.js`:
   ```javascript
   const USERNAME = process.env.GITHUB_USERNAME || 'YOUR-GITHUB-USERNAME';
   ```
4. **Enable GitHub Pages**:
   - Go to **Settings** → **Pages**
   - Source: **GitHub Actions**
5. **Configure Actions permissions**:
   - **Settings** → **Actions** → **General**
   - Workflow permissions: **Read and write permissions**
   - Enable: **Allow GitHub Actions to create and approve pull requests**
6. **Run first update**:
   - Go to **Actions** tab → **"Update Stars and Deploy to Pages"** → **"Run workflow"**

### ⚙️ **Advanced Configuration**

#### **Customize Update Frequency**
```yaml
# In .github/workflows/update-data.yml
schedule:
  - cron: '0 */3 * * *'  # Every 3 hours instead of 6
```

#### **Add Custom Categories**
```javascript
// In app.js and scripts/fetch-data.js, modify the categories object
'my-category': {
  strong: ['exact-framework-name', 'specific-tool'],
  medium: ['general-term', 'category-keyword'],
  weak: ['common-word']
}
```

#### **Customize Colors**
```javascript
// In app.js, modify the categoryColors object
this.categoryColors = {
  'my-category': '#FF6B6B',  // Custom color
  // ... existing colors
};
```

---

## 🔄 **How Automatic Updates Work**

### 📅 **Scheduled Updates**
The GitHub Actions workflow automatically:

1. **🕐 Runs every 6 hours** (00:00, 06:00, 12:00, 18:00 UTC)
2. **📡 Fetches ALL starred repositories** using GitHub API (handles pagination for 958+ repos)
3. **🏷️ Categorizes each repository** using intelligent weighted scoring
4. **💾 Saves structured data** to `data/repositories.json`
5. **📝 Commits changes** with timestamp and repository count
6. **🚀 Auto-deploys** updated visualization to GitHub Pages

### 🎯 **Manual Updates**

**From the app UI:**
- Click the "🔄 Refresh Data" button in the header
- It opens the Actions page: "Update Stars and Deploy to Pages"
- Click "Run workflow" → "Run workflow"
- Within 2-3 minutes, Pages redeploys automatically

**Using GitHub CLI:**
```bash
gh workflow run update-data.yml --ref main
```

### 🧪 **Run Locally**
```bash
# Generate data locally
GITHUB_USERNAME=your-username node scripts/fetch-data.js > data/repositories.json

# Serve statically like GitHub Pages
npx -y serve -l 4000 -s .
# Open http://localhost:4000
```

---

## 📱 **Device Compatibility**

### 💻 **Desktop Experience**
- Full feature set with all controls and interactions
- Keyboard shortcuts (Escape to reset filters)
- Precise mouse interactions for detailed exploration
- Large screen optimization for better clustering visibility

### 📱 **Mobile Experience** (NEW!)
- **Touch-friendly interface** with collapsible navigation panels
- **Hamburger-style toggles** for filters (⚙️) and legend (🎨)
- **Smart tooltips** that adjust position to stay within viewport
- **Responsive layouts** for portrait and landscape orientations
- **Gesture support**: Pinch-to-zoom, swipe, drag interactions
- **44px minimum tap targets** for accessibility
- **Optimized breakpoints** for all screen sizes

### 🌐 **Browser Support**
- ✅ **Chrome/Chromium** (recommended)
- ✅ **Firefox**
- ✅ **Safari** (desktop and iOS)
- ✅ **Edge**
- ✅ **Mobile browsers** (Chrome Mobile, Safari iOS, Samsung Internet)
- ⚠️ **Internet Explorer**: Not supported

---

## 🔧 **Troubleshooting Guide**

### 🚨 **Common Issues & Solutions**

#### **Issue: Site shows 404 error**
**Solution**:
- Wait 5-10 minutes after first deployment
- Check that GitHub Pages is set to "GitHub Actions" in Settings → Pages
- Verify the workflow completed successfully (green checkmark in Actions)

#### **Issue: Mobile panels won't open**
**Solution**:
- Look for ⚙️ and 🎨 buttons at bottom-left corner
- Ensure JavaScript is enabled in your browser
- Try refreshing the page
- Check browser console for errors

#### **Issue: 0 visible repositories**
**Solution**:
- Click "All" button in category filters to reset
- Clear search box if you have text in it
- Press Escape key to reset all filters
- Try refreshing the page

#### **Issue: Workflow fails with rate limit**
**Solution**:
- GitHub allows 5,000 requests/hour with authentication
- The GITHUB_TOKEN is automatically provided by Actions
- If issues persist, check Actions logs for details

#### **Issue: Graph looks cluttered**
**Solution**:
- Use category filters to focus on specific types
- Try star count filters (10K+, 50K+) to see only popular repos
- Use search to find specific repositories
- Zoom in to see detailed areas, zoom out for overview
- On mobile, use collapsible panels to maximize graph space

---

## 📊 **Data Structure & API**

### 📋 **Repository Data Format**
```json
{
  "repositories": [
    {
      "id": 669879380,
      "name": "LLMs-from-scratch",
      "owner": "rasbt",
      "fullName": "rasbt/LLMs-from-scratch",
      "description": "Implement a ChatGPT-like LLM in PyTorch from scratch",
      "url": "https://github.com/rasbt/LLMs-from-scratch",
      "language": "Jupyter Notebook",
      "stars": 73565,
      "forks": 10699,
      "category": "ai-ml",
      "updatedAt": "2025-10-28T06:32:44.599Z",
      "topics": ["machine-learning", "pytorch", "llm"]
    }
  ],
  "lastUpdated": "2025-10-28T06:32:44.599Z",
  "totalCount": 958,
  "categoryStats": {
    "ai-ml": 247,
    "python": 112,
    "web-dev": 91
  },
  "languageStats": {
    "JavaScript": 145,
    "Python": 134,
    "TypeScript": 89
  }
}
```

---

## 🎨 **Customization Options**

### 🎯 **Add Custom Categories**
Update both `app.js` and `scripts/fetch-data.js`:
```javascript
this.categories = {
  'my-category': {
    strong: ['exact-match', 'specific-framework'],  // 10 points
    medium: ['general-term', 'category-keyword'],   // 5 points
    weak: ['common-descriptor']                     // 2 points
  },
  // ... existing categories
};
```

### 🌈 **Change Color Scheme**
Update `app.js`:
```javascript
this.categoryColors = {
  'my-category': '#YOUR-COLOR',
  // ... other categories
};
```

### ⏰ **Adjust Update Frequency**
Modify `.github/workflows/update-data.yml`:
```yaml
schedule:
  - cron: '0 */2 * * *'  # Every 2 hours
  - cron: '0 8 * * *'    # Daily at 8 AM UTC
  - cron: '0 0 * * 0'    # Weekly on Sunday
```

---

## 🚀 **Performance & Limits**

### 📈 **Performance Metrics**
- **Repository Capacity**: Up to 1,000 starred repositories (GitHub API limit)
- **Load Time**: 2-5 seconds for 958+ repositories
- **Rendering**: Optimized D3.js with efficient force simulation
- **Memory Usage**: ~80-120MB for full dataset in browser
- **Mobile Performance**: Optimized with efficient rendering and touch handling

### 📊 **API Limits & Usage**
- **GitHub API**: 5,000 requests/hour (authenticated via Actions)
- **Repository Fetch**: ~10 API calls for 958 repositories (100 per page)
- **Rate Limiting**: Built-in delays between API requests
- **Caching**: Data stored in repository to reduce API calls

---

## 📄 **License & Credits**

### 📜 **License**
MIT License - Feel free to use, modify, and distribute!

### 🙏 **Credits**
- **Built with**: D3.js by Mike Bostock
- **Powered by**: GitHub API and GitHub Actions
- **Hosted on**: GitHub Pages
- **Enhanced by**: Claude Code (AI-assisted development)
- **Inspired by**: The amazing open source community

### ⭐ **Support**
If you find this project helpful:
- Give it a star ⭐ on GitHub
- Share it with other developers
- Contribute improvements
- [Report issues](https://github.com/niranjanxprt/starred-repos-graph/issues) or suggestions

---

## 📝 **Changelog**

### **v3.0.0** - 2025-10-28 🎉
- 🧠 **Intelligent Categorization System**: Advanced weighted scoring algorithm
  - Word boundary matching to prevent false positives
  - Multi-factor analysis (name, description, topics, language)
  - Weighted keywords: Strong (10pts), Medium (5pts), Weak (2pts)
  - Topic bonuses and language boosts
  - Fixed misclassifications (kubernetes→devops, AWS→cloud)
- 🆕 **New Categories**: Cloud, Monitoring, Testing, Networking (19 total)
- 📊 **Improved Distribution**: AI/ML 43%→26%, DevOps 2%→4%, Cloud 0%→3%
- 🎨 **Dark Professional Theme**: Optimized background for better node visibility
- 📱 **Mobile-Responsive Design**: Complete mobile optimization
  - Collapsible navigation panels with hamburger toggles
  - Touch-friendly controls (44px minimum tap targets)
  - Smart tooltip positioning
  - Landscape orientation support
  - Responsive breakpoints (480px, 768px, 1024px)
- 🔧 **Backend Synchronization**: Applied scoring to both frontend and data fetch script

### **v2.1.0** - 2025-09-29
- 🎨 Enhanced visualization with strategic category positioning
- 🐍 Fixed Python language filter
- 🔗 Improved clustering with intelligent repository connections
- 📊 Better node sizing and visual hierarchy
- 🎯 Enhanced tooltips with richer repository information

### **v2.0.0** - 2025-09-29
- 🤖 Complete GitHub Actions automation (every 6 hours)
- 📊 Smart categorization system with 15 categories
- 🔍 Advanced filtering (search, category, language, stars)
- 🎨 Modern glassmorphism UI
- 📱 Basic responsive layout

### **v1.0.0** - 2025-09-29
- 🌟 Initial release with D3.js force-directed graph
- 📁 Basic category organization
- 🔍 Simple search functionality

---

**🌟 Explore the fascinating world of open source through interactive visualization!**

*Transform your GitHub stars into beautiful, intelligent insights with advanced categorization, mobile-responsive design, and automatic updates.* 🚀

**Live Demo**: https://niranjanxprt.github.io/starred-repos-graph/
