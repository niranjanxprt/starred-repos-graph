# 🌟 GitHub Stars Graph Visualization

> **Interactive force-directed graph of ALL your GitHub starred repositories with automatic updates**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-View%20App-blue?style=for-the-badge&logo=github)](https://niranjanxprt.github.io/starred-repos-graph/)
[![Auto Update](https://img.shields.io/badge/🔄%20Auto%20Update-Every%206%20Hours-green?style=for-the-badge)](https://github.com/niranjanxprt/starred-repos-graph/actions)
[![Repositories](https://img.shields.io/badge/📦%20Repositories-698%2B-orange?style=for-the-badge)](https://github.com/niranjanxprt?tab=stars)
[![GitHub Pages](https://img.shields.io/badge/🌐%20GitHub%20Pages-Live-success?style=for-the-badge)](https://niranjanxprt.github.io/starred-repos-graph/)

## 🎯 **Live Application**

**🔗 [https://niranjanxprt.github.io/starred-repos-graph/](https://niranjanxprt.github.io/starred-repos-graph/)**

*Click above to explore an interactive visualization of 698+ starred repositories with intelligent clustering, filtering, and real-time updates!*

---

## ✨ **Key Features**

### 🎨 **Interactive Graph Visualization**
- **Force-directed network graph** showing all 698+ starred repositories as connected nodes
- **Intelligent clustering** - repositories group by category with strategic positioning
- **Click any node** to instantly open the repository in GitHub
- **Drag nodes** around to explore relationships and reorganize
- **Zoom and pan** for detailed exploration of different areas
- **Smart connections** between related repositories within and across categories

### 🧠 **Smart Categorization System**

| Category | Count | Color | Examples |
|----------|-------|-------|----------|
| 🤖 **AI/ML** | 324 | Purple | LLMs, Machine Learning, AI Agents, RAG Systems |
| 🌐 **Web Dev** | 104 | Green | React, Next.js, Vue, Full-stack Frameworks |
| 🐍 **Python** | 85 | Amber | Django, Flask, Data Science, Python Tools |
| 📊 **Data** | 33 | Blue | Databases, Analytics, ETL, Data Engineering |
| 🛠️ **Tools** | 31 | Gray | CLI Tools, IDEs, Productivity Apps |
| 📱 **Mobile** | 26 | Red | React Native, Flutter, iOS/Android |
| 📚 **Learning** | 21 | Lime | Tutorials, Courses, Educational Resources |
| 🚀 **DevOps** | 10 | Cyan | Docker, Kubernetes, CI/CD, Infrastructure |
| 🎨 **UI/UX** | 9 | Pink | Design Systems, Components, Animations |
| 🔗 **API** | 7 | Violet | REST APIs, GraphQL, SDKs, Microservices |
| *+ 5 more* | 48 | Various | Gaming, Security, Blockchain, MCP, Other |

### 🔍 **Advanced Filtering & Search**
- **Real-time search** by repository name, description, owner, or language
- **Category filtering** - click legend items or category buttons to focus
- **Language filtering** - filter by programming language (JavaScript, Python, TypeScript, etc.)
- **Star count filtering** - view only popular repositories (1K+, 5K+, 10K+, 50K+)
- **Visual feedback** - filtered results update graph in real-time
- **Reset functionality** - clear all filters with Escape key or reset button

### 🔄 **Fully Automated Updates**
- **GitHub Actions workflow** runs every 6 hours automatically
- **Fetches ALL starred repositories** via GitHub API (handles pagination)
- **Smart categorization** using advanced keyword matching algorithms
- **Auto-deployment** to GitHub Pages after each update
- **Commit tracking** - see update history in repository commits
- **Zero maintenance** - completely hands-off operation

---

## 🎮 **How to Use the App**

### 🖱️ **Navigation Controls**
1. **Zoom**: Mouse wheel or trackpad pinch to zoom in/out
2. **Pan**: Click and drag empty space to move around the graph
3. **Drag Nodes**: Click and drag individual repositories to reposition
4. **Click to Open**: Click any node to open the repository in GitHub

### 🔍 **Filtering & Search**
1. **Search Bar**: Type to find repositories by name, description, or language
2. **Category Buttons**: Click category filters or legend items to focus on specific types
3. **Language Dropdown**: Filter by programming language (now includes Python!)
4. **Star Filters**: Show only popular repositories with minimum star counts
5. **Reset**: Press `Escape` key or use reset button to clear all filters

### 📊 **Understanding the Visualization**
- **Node Size**: Larger nodes = more popular repositories (higher star count)
- **Node Color**: Each color represents a different category (see legend)
- **Connections**: Lines connect related repositories (same category/language)
- **Positioning**: Force-directed physics groups similar repositories together
- **Clusters**: Categories are positioned in different areas for better organization

---

## 🛠️ **Technical Architecture**

### 📁 **Project Structure**
```
starred-repos-graph/
├── index.html          # Main application interface
├── app.js             # Core D3.js visualization logic
├── data/              # Auto-generated repository data
│   ├── repositories.json   # Complete repository dataset
│   └── .gitkeep           # Directory placeholder
├── .github/workflows/      # GitHub Actions automation
│   └── update-data.yml    # Scheduled data fetching workflow
└── README.md          # This documentation
```

### 💻 **Technology Stack**
- **Frontend**: Vanilla JavaScript + D3.js v7 (no frameworks needed)
- **Visualization**: D3.js force-directed graph with custom physics simulation
- **Styling**: Modern CSS with glassmorphism effects and responsive design
- **Data Source**: GitHub API (real-time repository data with pagination)
- **Automation**: GitHub Actions (scheduled data updates every 6 hours)
- **Deployment**: GitHub Pages (automatic deployment pipeline)
- **Storage**: JSON files (version-controlled repository data)

### 🧮 **Algorithm Details**
- **Categorization**: Advanced keyword matching across name, description, and topics
- **Physics**: Custom force simulation with collision detection and category clustering
- **Performance**: Optimized for 698+ repositories with efficient rendering
- **Linking**: Intelligent connections within categories and between popular repositories

---

## 📊 **Repository Statistics**

### 📈 **Current Numbers**
- **Total Repositories**: 698+ (automatically counted)
- **Programming Languages**: 25+ (JavaScript, Python, TypeScript, Java, Go, Rust, etc.)
- **Categories**: 15 intelligent auto-categories
- **Update Frequency**: Every 6 hours via GitHub Actions
- **Data Freshness**: Always current with your latest stars
- **Average Stars per Repository**: ~15,000
- **Most Popular Language**: JavaScript (145+ repositories)
- **Largest Category**: AI/ML (324 repositories)
- **Growth Rate**: Tracks new stars automatically

### 🏆 **Top Categories by Repository Count**
1. 🤖 **AI/ML**: 324 repositories (46% of total)
2. 🌐 **Web Development**: 104 repositories (15% of total)
3. 🐍 **Python**: 85 repositories (12% of total)
4. 📊 **Data Engineering**: 33 repositories (5% of total)
5. 🛠️ **Developer Tools**: 31 repositories (4% of total)

---

## 🚀 **Setup & Configuration**

### 🎯 **Quick Setup (For Your Own Stars)**

1. **Fork this repository**
2. **Update username** in `.github/workflows/update-data.yml`:
   ```yaml
   USERNAME: 'YOUR-GITHUB-USERNAME'  # Change this line
   ```
3. **Enable GitHub Pages**:
   - Go to **Settings** → **Pages**
   - Source: **GitHub Actions**
4. **Configure Actions permissions**:
   - **Settings** → **Actions** → **General**
   - Workflow permissions: **Read and write permissions**
   - Enable: **Allow GitHub Actions to create and approve pull requests**
5. **Run first update**:
   - Go to **Actions** tab → **"Update Starred Repositories Data"** → **"Run workflow"**

### ⚙️ **Advanced Configuration**

#### **Customize Update Frequency**
```yaml
# In .github/workflows/update-data.yml
schedule:
  - cron: '0 */3 * * *'  # Every 3 hours instead of 6
```

#### **Add Custom Categories**
```javascript
// In app.js, modify the categories object
this.categories = {
  'my-category': ['keyword1', 'keyword2', 'keyword3'],
  // ... existing categories
};
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
2. **📡 Fetches ALL starred repositories** using GitHub API (handles pagination for 698+ repos)
3. **🏷️ Categorizes each repository** using intelligent keyword matching
4. **💾 Saves structured data** to `data/repositories.json`
5. **📝 Commits changes** with timestamp and repository count
6. **🚀 Auto-deploys** updated visualization to GitHub Pages

### 🎯 **Manual Updates**

You can refresh data in two ways:

1) From the app UI
- Click the "🔄 Refresh Data" button in the header
- It opens the Actions page: Update Stars and Deploy to Pages
- Click "Run workflow" (no parameters needed)
- Within ~1–2 minutes, Pages redeploys automatically and the app will show the new data timestamp under Updated

2) Using GitHub CLI
```bash
# Trigger the workflow manually
gh workflow run update-data.yml --ref main -R niranjanxprt/starred-repos-graph
```

### 🌐 Live URL
- https://niranjanxprt.github.io/starred-repos-graph/

### 🧪 Run Locally (static, Pages-like)
```bash
# Generate data locally (avoids API rate limits in browser)
GITHUB_USERNAME=niranjanxprt node scripts/fetch-data.js > data/repositories.json

# Serve statically like GitHub Pages
npx -y serve -l 4000 -s .
# Open http://localhost:4000
```
Trigger updates anytime:
1. Go to the **Actions** tab in your repository
2. Select **"Update Starred Repositories Data"**
3. Click **"Run workflow"** → **"Run workflow"**
4. Wait 2-3 minutes for completion

### 🔄 **Real-time Sync Process**
When you star a new repository:
- ✅ **Next scheduled run** (within 6 hours) automatically picks it up
- ✅ **Gets categorized** based on name, description, and topics
- ✅ **Appears in graph** with appropriate color and positioning
- ✅ **Updates statistics** and filters automatically
- ✅ **Zero manual intervention** required!

---

## 📱 **Device Compatibility**

### 💻 **Desktop Experience**
- **Full feature set** with all controls and interactions
- **Keyboard shortcuts** (Escape to reset filters)
- **Precise mouse interactions** for detailed exploration
- **Large screen optimization** for better clustering visibility

### 📱 **Mobile Experience**
- **Touch-friendly interface** with responsive design
- **Pinch to zoom** and touch drag functionality
- **Adapted layout** with collapsible controls
- **Mobile-optimized tooltips** and interactions

### 🌐 **Browser Support**
- ✅ **Chrome/Chromium** (recommended)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Edge**
- ⚠️ **Internet Explorer**: Not supported (modern JavaScript required)

---

## 🔧 **Troubleshooting Guide**

### 🚨 **Common Issues & Solutions**

#### **Issue: Site shows 404 error**
**Solution**: 
- Wait 5-10 minutes after first deployment
- Check that GitHub Pages is set to "GitHub Actions" in Settings → Pages
- Verify the workflow completed successfully (green checkmark in Actions)

#### **Issue: 0 visible repositories**
**Solution**:
- Click "All" button in category filters to reset
- Clear search box if you have text in it
- Check browser console for JavaScript errors
- Try refreshing the page

#### **Issue: Missing languages (like Python)**
**Solution**:
- The language filter builds from actual repository data
- If missing, manually trigger workflow: Actions → "Update Starred Repositories Data" → "Run workflow"
- Languages appear based on what's in your starred repositories

#### **Issue: Workflow fails with rate limit**
**Solution**:
- GitHub allows 60 requests/hour for unauthenticated requests
- For higher limits, add a personal access token:
  1. Settings → Secrets and variables → Actions
  2. New repository secret: `GITHUB_TOKEN`
  3. Value: Your personal access token with `public_repo` scope

#### **Issue: Graph looks cluttered**
**Solution**:
- Use category filters to focus on specific types
- Try star count filters (10K+, 50K+) to see only popular repos
- Use search to find specific repositories
- Zoom in to see detailed areas, zoom out for overview

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
      "updatedAt": "2025-09-29T10:00:00Z",
      "topics": ["machine-learning", "pytorch", "llm"]
    }
  ],
  "lastUpdated": "2025-09-29T12:00:00Z",
  "totalCount": 698,
  "categoryStats": {
    "ai-ml": 324,
    "web-dev": 104,
    "python": 85
  },
  "languageStats": {
    "JavaScript": 145,
    "Python": 134,
    "TypeScript": 89
  }
}
```

### 🔄 **GitHub Actions Workflow**
The automation workflow (`update-data.yml`) performs:
1. **Fetches** starred repositories via GitHub API
2. **Processes** and categorizes each repository
3. **Generates** structured JSON data files
4. **Commits** changes to the repository
5. **Deploys** to GitHub Pages automatically

---

## 🎨 **Customization Options**

### 🎯 **Add Custom Categories**
Modify the `categories` object in `app.js`:
```javascript
this.categories = {
  'my-custom-category': ['keyword1', 'keyword2', 'keyword3'],
  'ai-ml': ['ai', 'machine learning', 'llm', ...],
  // ... existing categories
};
```

### 🌈 **Change Color Scheme**
Update the `categoryColors` object:
```javascript
this.categoryColors = {
  'ai-ml': '#YOUR-COLOR',
  'web-dev': '#ANOTHER-COLOR',
  // ... other categories
};
```

### ⏰ **Adjust Update Frequency**
Modify the cron schedule in `.github/workflows/update-data.yml`:
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
- **Load Time**: 2-5 seconds for 698+ repositories
- **Rendering**: Optimized D3.js with efficient force simulation
- **Memory Usage**: ~50-100MB for full dataset in browser

### 📊 **API Limits & Usage**
- **GitHub API**: 5,000 requests/hour (authenticated) or 60/hour (public)
- **Repository Fetch**: ~7 API calls for 698 repositories (100 per page)
- **Rate Limiting**: Built-in delays between API requests
- **Caching**: Data stored in repository to reduce API calls

---

## 🤝 **Contributing**

### 💡 **Feature Ideas**
- 🕐 **Timeline view**: Show repositories by star date
- 📊 **Analytics dashboard**: Trending categories, language popularity
- 🔍 **Advanced search**: Date ranges, topic filtering, contributor search
- 🎨 **Visualization modes**: Treemap, circular packing, hierarchical
- 📱 **Mobile app**: Native iOS/Android companion
- 🔗 **GitHub integration**: Show issues, PRs, recent activity
- 🤖 **AI insights**: Repository recommendations, trending analysis

### 🔄 **How to Contribute**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes and test thoroughly
4. **Commit** changes (`git commit -m 'Add amazing feature'`)
5. **Push** to branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request with detailed description

### 🎯 **Areas for Improvement**
- Performance optimization for 1000+ repositories
- Additional visualization layouts and themes
- Enhanced mobile experience
- Better clustering algorithms
- Export functionality (PNG, SVG, PDF)

---

## 📚 **Resources & Links**

### 🔗 **Related Projects**
- [D3.js Documentation](https://d3js.org/) - Visualization library
- [GitHub API Documentation](https://docs.github.com/en/rest) - API reference
- [GitHub Actions Documentation](https://docs.github.com/en/actions) - Workflow automation
- [GitHub Pages Documentation](https://docs.github.com/en/pages) - Static site hosting

### 🎓 **Learning Resources**
- [D3.js Force Simulation](https://observablehq.com/@d3/force-directed-graph) - Interactive examples
- [GitHub API Best Practices](https://docs.github.com/en/rest/guides/best-practices-for-integrators) - API usage guide
- [Force-Directed Graph Algorithms](https://en.wikipedia.org/wiki/Force-directed_graph_drawing) - Theory background

---

## 📄 **License & Credits**

### 📜 **License**
MIT License - Feel free to use, modify, and distribute!

### 🙏 **Credits**
- **Built with**: D3.js by Mike Bostock
- **Powered by**: GitHub API and GitHub Actions
- **Hosted on**: GitHub Pages
- **Inspired by**: The amazing open source community

### ⭐ **Support**
If you find this project helpful:
- Give it a star ⭐ on GitHub
- Share it with other developers
- Contribute improvements
- [Report issues](https://github.com/niranjanxprt/starred-repos-graph/issues) or suggestions

---

## 📝 **Changelog**

### **v2.1.0** - 2025-09-29
- 🎨 Enhanced visualization with strategic category positioning
- 🐍 Fixed Python language filter (now properly included)
- 🔗 Improved clustering with intelligent repository connections
- 📊 Better node sizing and visual hierarchy
- 🎯 Enhanced tooltips with richer repository information

### **v2.0.0** - 2025-09-29
- 🤖 Complete GitHub Actions automation (every 6 hours)
- 📊 Smart categorization system with 15 categories
- 🔍 Advanced filtering (search, category, language, stars)
- 🎨 Modern glassmorphism UI with responsive design
- 📱 Mobile-friendly responsive layout

### **v1.0.0** - 2025-09-29
- 🌟 Initial release with D3.js force-directed graph
- 📁 Basic category organization
- 🔍 Simple search functionality

---

**🌟 Explore the fascinating world of open source through interactive visualization!**

*"The best way to understand code is to see how it connects."* - Transform your GitHub stars into insights! 🚀