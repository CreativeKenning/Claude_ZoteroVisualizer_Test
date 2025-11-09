# Zotero Library Visualizer

An interactive website that visualizes the contents of a Zotero group library, showing scholarly trends through beautiful data visualizations inspired by Wassily Kandinsky's Composition VIII.

## Features

- **Stream Graph**: Visualize tag trends over time, showing how research topics have evolved
- **Publications Timeline**: Interactive timeline showing the number of publications per year
- **Top Tags by Year**: Click on any year to see a bar chart of the most common tags for that year
- **Kandinsky-Inspired Design**: Bold colors, geometric shapes, and dynamic layout inspired by Composition VIII
- **Automatic Data Fetching**: Loads data directly from the Zotero API on page load
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

- **Vanilla JavaScript**: No frameworks, just clean ES6+ modules
- **Google Charts API**: Professional, interactive visualizations
- **GitHub Pages**: Static hosting with automatic deployment
- **GitHub Actions**: Secure API key injection during build

## Project Structure

```
/
├── index.html              # Main page with chart containers
├── css/
│   └── styles.css         # Kandinsky-inspired CSS styling
├── js/
│   ├── config.js          # Configuration (API key injected by GitHub Actions)
│   ├── zotero-api.js      # Zotero API fetch logic with pagination
│   ├── data-processor.js  # Data aggregation and transformation
│   └── charts.js          # Google Charts rendering
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment workflow
└── README.md              # This file
```

## Setup Instructions

### 1. Get Your Zotero API Key

1. Go to [Zotero Settings](https://www.zotero.org/settings/keys)
2. Click "Create new private key"
3. Give it a name (e.g., "Library Visualizer")
4. Select "Allow library access" for the group you want to visualize
5. Copy the generated API key

### 2. Configure GitHub Repository

1. Fork or clone this repository
2. Go to your repository Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `ZOTERO_API_KEY`
5. Value: Paste your Zotero API key
6. Click "Add secret"

### 3. Configure Group ID

If you want to visualize a different Zotero group:

1. Open `js/config.js`
2. Change the `groupId` value to your group's ID
3. You can find your group ID in the URL: `https://www.zotero.org/groups/YOUR_GROUP_ID/group-name`

### 4. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Under "Build and deployment":
   - Source: "GitHub Actions"
3. The workflow will automatically deploy on the next push to `main`

### 5. Deploy

1. Push your changes to the `main` branch
2. The GitHub Action will automatically:
   - Inject your API key into the code
   - Deploy to GitHub Pages
3. Your site will be available at: `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`

## Development

To test locally:

1. Replace `__ZOTERO_API_KEY__` in `js/config.js` with your actual API key
2. Serve the files with a local web server:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser

**Important**: Don't commit your actual API key! The placeholder `__ZOTERO_API_KEY__` should remain in the repository.

## Customization

### Change Colors

Edit the color palette in `css/styles.css`:

```css
:root {
    --kandinsky-gold: #FFD700;
    --kandinsky-red: #E63946;
    /* ... modify other colors ... */
}
```

### Adjust Chart Settings

Modify settings in `js/config.js`:

```javascript
charts: {
    topTagsCount: 15,        // Number of tags in bar chart
    streamGraphTags: 10,     // Number of tags in stream graph
    colors: [...]            // Chart color palette
}
```

### Change Visualization Types

Google Charts supports many chart types. Edit `js/charts.js` to use different visualizations:
- `AreaChart`, `LineChart`, `ColumnChart`, `BarChart`, `PieChart`, etc.

## How It Works

1. **Data Fetching** (`zotero-api.js`):
   - Fetches all items from the Zotero group library using the API
   - Handles pagination automatically (100 items per request)
   - Extracts tags, year, title, creators, and other metadata

2. **Data Processing** (`data-processor.js`):
   - Aggregates publications by year
   - Counts tag occurrences over time
   - Identifies most common tags for each year

3. **Visualization** (`charts.js`):
   - Renders three interactive Google Charts
   - Adds click handlers for year selection
   - Updates bar chart when timeline is clicked

4. **Security** (GitHub Actions):
   - API key stored as GitHub Secret (never in code)
   - Injected during build process
   - Not visible in repository or to visitors

## Troubleshooting

### Charts not loading?
- Check browser console for errors
- Verify API key is set in GitHub Secrets
- Ensure the workflow ran successfully (check Actions tab)

### No data appearing?
- Verify the group ID is correct in `js/config.js`
- Check that your API key has access to the group
- Look for API errors in browser console

### Deployment failed?
- Check that `ZOTERO_API_KEY` secret is set
- Verify GitHub Pages is enabled
- Review workflow logs in Actions tab

## Credits

- Design inspired by **Wassily Kandinsky's Composition VIII** (1923)
- Data from **Zotero** bibliographic management
- Visualizations powered by **Google Charts**
- A test of agentic AI's ability to create a website that visualizes a Zotero library

## License

MIT License - feel free to use and modify for your own projects!
