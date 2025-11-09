// Zotero API integration module
import { CONFIG } from './config.js';

/**
 * Fetches all items from the Zotero group library
 * Handles pagination automatically
 * @returns {Promise<Array>} Array of all library items
 */
export async function fetchAllItems() {
    let allItems = [];
    let start = 0;
    let totalResults = null;

    try {
        while (totalResults === null || start < totalResults) {
            const response = await fetchItemsPage(start);

            // Get total number of results from header on first request
            if (totalResults === null) {
                totalResults = parseInt(response.totalResults, 10);
            }

            allItems = allItems.concat(response.items);
            start += CONFIG.itemsPerPage;

            // Log progress
            console.log(`Fetched ${allItems.length} of ${totalResults} items`);
        }

        console.log(`Successfully fetched all ${allItems.length} items`);
        return allItems;

    } catch (error) {
        console.error('Error fetching Zotero items:', error);
        throw error;
    }
}

/**
 * Fetches a single page of items from the Zotero API
 * @param {number} start - Starting index for pagination
 * @returns {Promise<Object>} Object containing items and total count
 */
async function fetchItemsPage(start) {
    const urlString = `${CONFIG.apiBaseUrl}/groups/${CONFIG.groupId}/items`;
    const url = new URL(urlString);
    url.searchParams.append('start', start);
    url.searchParams.append('limit', CONFIG.itemsPerPage);
    url.searchParams.append('format', 'json');

    const headers = {
        'Zotero-API-Version': '3'
    };

    // Add API key if available
    if (CONFIG.apiKey && CONFIG.apiKey !== '__ZOTERO_API_KEY__') {
        headers['Authorization'] = `Bearer ${CONFIG.apiKey}`;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
        throw new Error(`Zotero API error: ${response.status} ${response.statusText}`);
    }

    // Get total results from header
    const totalResults = response.headers.get('Total-Results');

    const items = await response.json();

    return {
        items,
        totalResults
    };
}

/**
 * Extracts and structures relevant data from Zotero items
 * @param {Array} items - Raw items from Zotero API
 * @returns {Array} Processed items with relevant fields
 */
export function processItems(items) {
    return items.map(item => {
        const data = item.data;

        // Extract year from date
        let year = null;
        if (data.date) {
            // Try to extract year from various date formats
            const yearMatch = data.date.match(/\d{4}/);
            if (yearMatch) {
                year = parseInt(yearMatch[0], 10);
            }
        }

        // Extract tags
        const tags = data.tags ? data.tags.map(tag => tag.tag) : [];

        // Extract creators (authors)
        const creators = data.creators ? data.creators.map(creator => {
            if (creator.name) {
                return creator.name;
            }
            return `${creator.firstName || ''} ${creator.lastName || ''}`.trim();
        }).filter(name => name) : [];

        return {
            key: data.key,
            title: data.title || 'Untitled',
            year: year,
            tags: tags,
            creators: creators,
            itemType: data.itemType,
            publicationTitle: data.publicationTitle || '',
            date: data.date || ''
        };
    }).filter(item => item.year !== null); // Filter out items without a valid year
}
