// Configuration for Zotero API
// API key will be injected by GitHub Actions during deployment

export const CONFIG = {
    // This placeholder will be replaced by GitHub Actions
    apiKey: '__ZOTERO_API_KEY__',

    // Group ID for the Zotero library
    groupId: '6297645',

    // Zotero API base URL
    apiBaseUrl: 'https://api.zotero.org',

    // Pagination settings
    itemsPerPage: 100,

    // Chart settings
    charts: {
        // Number of top tags to show in bar chart
        topTagsCount: 15,

        // Number of top tags to show in stream graph
        streamGraphTags: 10,

        // Kandinsky-inspired color palette
        colors: [
            '#FFD700', // Gold
            '#E63946', // Red
            '#457B9D', // Blue
            '#FFC30B', // Yellow
            '#D62828', // Dark Red
            '#1D3557', // Navy
            '#F77F00', // Orange
            '#06A77D', // Teal
            '#8338EC', // Purple
            '#0A0908', // Black
            '#FB5607', // Bright Orange
            '#3A86FF', // Bright Blue
            '#FF006E', // Pink
            '#FFBE0B', // Bright Yellow
            '#06FFA5'  // Mint
        ]
    }
};
