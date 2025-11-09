// Data processing and aggregation module
import { CONFIG } from './config.js';

/**
 * Processes items for the publications timeline chart
 * Groups items by year and counts them
 * @param {Array} items - Processed Zotero items
 * @returns {Array} Array of [year, count] pairs
 */
export function prepareTimelineData(items) {
    const yearCounts = {};

    items.forEach(item => {
        if (item.year) {
            yearCounts[item.year] = (yearCounts[item.year] || 0) + 1;
        }
    });

    // Convert to array and sort by year
    const timelineData = Object.entries(yearCounts)
        .map(([year, count]) => [parseInt(year, 10), count])
        .sort((a, b) => a[0] - b[0]);

    return timelineData;
}

/**
 * Processes items for the stream graph showing tag trends over time
 * @param {Array} items - Processed Zotero items
 * @param {number} topN - Number of top tags to include
 * @returns {Object} Object with years array and data for each tag
 */
export function prepareStreamGraphData(items, topN = CONFIG.charts.streamGraphTags) {
    // First, get the most common tags overall
    const allTagCounts = {};
    items.forEach(item => {
        item.tags.forEach(tag => {
            allTagCounts[tag] = (allTagCounts[tag] || 0) + 1;
        });
    });

    // Get top N tags
    const topTags = Object.entries(allTagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([tag]) => tag);

    // Now count these tags by year
    const tagsByYear = {};

    items.forEach(item => {
        if (!item.year) return;

        if (!tagsByYear[item.year]) {
            tagsByYear[item.year] = {};
            topTags.forEach(tag => {
                tagsByYear[item.year][tag] = 0;
            });
        }

        item.tags.forEach(tag => {
            if (topTags.includes(tag)) {
                tagsByYear[item.year][tag]++;
            }
        });
    });

    // Convert to format suitable for Google Charts
    const years = Object.keys(tagsByYear)
        .map(y => parseInt(y, 10))
        .sort((a, b) => a - b);

    // Create data rows: [year, tag1Count, tag2Count, ...]
    const chartData = years.map(year => {
        const row = [year.toString()];
        topTags.forEach(tag => {
            row.push(tagsByYear[year][tag] || 0);
        });
        return row;
    });

    return {
        headers: ['Year', ...topTags],
        data: chartData
    };
}

/**
 * Gets the top N tags for a specific year
 * @param {Array} items - Processed Zotero items
 * @param {number} year - The year to filter by
 * @param {number} topN - Number of top tags to return
 * @returns {Array} Array of [tag, count] pairs
 */
export function getTopTagsForYear(items, year, topN = CONFIG.charts.topTagsCount) {
    const tagCounts = {};

    items
        .filter(item => item.year === year)
        .forEach(item => {
            item.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

    // Convert to array, sort by count, and take top N
    const topTags = Object.entries(tagCounts)
        .map(([tag, count]) => [tag, count])
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN);

    return topTags;
}

/**
 * Gets items for a specific year (for tooltips)
 * @param {Array} items - Processed Zotero items
 * @param {number} year - The year to filter by
 * @returns {Array} Array of items from that year
 */
export function getItemsForYear(items, year) {
    return items.filter(item => item.year === year);
}

/**
 * Gets items with a specific tag in a specific year (for tooltips)
 * @param {Array} items - Processed Zotero items
 * @param {number} year - The year to filter by
 * @param {string} tag - The tag to filter by
 * @returns {Array} Array of items matching criteria
 */
export function getItemsForYearAndTag(items, year, tag) {
    return items.filter(item =>
        item.year === year && item.tags.includes(tag)
    );
}

/**
 * Gets all unique years from the items
 * @param {Array} items - Processed Zotero items
 * @returns {Array} Sorted array of years
 */
export function getAllYears(items) {
    const years = [...new Set(items.map(item => item.year))];
    return years.sort((a, b) => a - b);
}

/**
 * Gets statistics about the library
 * @param {Array} items - Processed Zotero items
 * @returns {Object} Statistics object
 */
export function getLibraryStats(items) {
    const years = getAllYears(items);
    const allTags = new Set();

    items.forEach(item => {
        item.tags.forEach(tag => allTags.add(tag));
    });

    return {
        totalItems: items.length,
        yearRange: years.length > 0 ? `${Math.min(...years)} - ${Math.max(...years)}` : 'N/A',
        totalTags: allTags.size
    };
}
