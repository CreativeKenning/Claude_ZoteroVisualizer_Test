// Google Charts rendering module
import { CONFIG } from './config.js';
import { fetchAllItems, processItems } from './zotero-api.js';
import {
    prepareTimelineData,
    prepareStreamGraphData,
    getTopTagsForYear,
    getItemsForYear,
    getAllYears
} from './data-processor.js';

// Global variable to store processed items
let processedItems = [];

/**
 * Main initialization function
 * Called when Google Charts is loaded
 */
export async function initializeApp() {
    try {
        // Show loading indicator
        showLoading();

        // Fetch and process data
        const rawItems = await fetchAllItems();
        processedItems = processItems(rawItems);

        console.log(`Processed ${processedItems.length} items with valid years`);

        // Hide loading, show content
        hideLoading();
        showContent();

        // Render all charts
        renderAllCharts();

    } catch (error) {
        console.error('Error initializing app:', error);
        showError(error.message);
    }
}

/**
 * Renders all three charts
 */
function renderAllCharts() {
    renderStreamGraph();
    renderTimeline();
    // Bar chart will be rendered when a year is selected
}

/**
 * Renders the stream graph showing tag trends over time
 */
function renderStreamGraph() {
    const streamData = prepareStreamGraphData(processedItems);

    // Create data table
    const data = new google.visualization.DataTable();
    streamData.headers.forEach((header, index) => {
        if (index === 0) {
            data.addColumn('string', header);
        } else {
            data.addColumn('number', header);
        }
    });

    data.addRows(streamData.data);

    // Chart options
    const options = {
        title: 'Tag Usage Over Time',
        isStacked: true,
        height: 400,
        legend: { position: 'right', maxLines: 3 },
        vAxis: { title: 'Number of Publications', minValue: 0 },
        hAxis: { title: 'Year' },
        colors: CONFIG.charts.colors,
        backgroundColor: '#FFFEF7',
        chartArea: { width: '70%', height: '70%' },
        tooltip: { isHtml: false }
    };

    // Draw chart
    const chart = new google.visualization.AreaChart(
        document.getElementById('stream-chart')
    );
    chart.draw(data, options);
}

/**
 * Renders the timeline showing publications per year
 */
function renderTimeline() {
    const timelineData = prepareTimelineData(processedItems);

    // Create data table
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Year');
    data.addColumn('number', 'Publications');
    data.addColumn({type: 'string', role: 'tooltip'});

    // Add rows with tooltips
    timelineData.forEach(([year, count]) => {
        const items = getItemsForYear(processedItems, year);
        const tooltip = `${year}\n${count} publication${count !== 1 ? 's' : ''}\n\nClick to see top tags`;
        data.addRow([year.toString(), count, tooltip]);
    });

    // Chart options
    const options = {
        title: 'Publications Per Year',
        height: 400,
        legend: { position: 'none' },
        vAxis: { title: 'Number of Publications', minValue: 0 },
        hAxis: { title: 'Year' },
        colors: [CONFIG.charts.colors[1]],
        backgroundColor: '#FFFEF7',
        chartArea: { width: '80%', height: '70%' },
        bar: { groupWidth: '75%' }
    };

    // Draw chart
    const chart = new google.visualization.ColumnChart(
        document.getElementById('timeline-chart')
    );

    // Add click handler for year selection
    google.visualization.events.addListener(chart, 'select', function() {
        const selection = chart.getSelection();
        if (selection.length > 0) {
            const row = selection[0].row;
            const year = parseInt(data.getValue(row, 0), 10);
            renderBarChartForYear(year);
        }
    });

    chart.draw(data, options);
}

/**
 * Renders the bar chart showing top tags for a specific year
 * @param {number} year - The year to show tags for
 */
function renderBarChartForYear(year) {
    const topTags = getTopTagsForYear(processedItems, year);

    if (topTags.length === 0) {
        document.getElementById('bar-chart').innerHTML =
            '<p style="text-align: center; padding: 50px;">No tags found for this year.</p>';
        return;
    }

    // Update label
    document.getElementById('selected-year-label').textContent =
        `Top tags in ${year}`;

    // Create data table
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Tag');
    data.addColumn('number', 'Count');
    data.addColumn({type: 'string', role: 'tooltip'});
    data.addColumn({type: 'string', role: 'style'});

    // Add rows with tooltips and colors
    topTags.forEach(([tag, count], index) => {
        const tooltip = `${tag}\n${count} publication${count !== 1 ? 's' : ''} in ${year}`;
        const color = CONFIG.charts.colors[index % CONFIG.charts.colors.length];
        data.addRow([tag, count, tooltip, `color: ${color}`]);
    });

    // Chart options
    const options = {
        title: `Top ${topTags.length} Tags in ${year}`,
        height: 500,
        legend: { position: 'none' },
        vAxis: { title: 'Tag' },
        hAxis: { title: 'Number of Publications', minValue: 0 },
        backgroundColor: '#FFFEF7',
        chartArea: { width: '70%', height: '75%' }
    };

    // Draw chart
    const chart = new google.visualization.BarChart(
        document.getElementById('bar-chart')
    );
    chart.draw(data, options);
}

/**
 * UI Helper Functions
 */
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    document.getElementById('error').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showContent() {
    document.getElementById('content').style.display = 'block';
}

function showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.getElementById('error-message').textContent = message;
}

// Handle window resize - redraw charts
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (processedItems.length > 0) {
            renderAllCharts();
        }
    }, 250);
});
