const axios = require('axios');
require('dotenv').config();

/**
 * Fetches Amazon product data using Rainforest API
 * @param {string} query - Search query for products
 * @returns {Array} - Array of Amazon products with standardized format
 */
const getAmazonProducts = async (query) => {
    const apiKey = process.env.RAINFOREST_API_KEY;

    if (!apiKey) {
        console.log('[AmazonAPI] No RAINFOREST_API_KEY found, skipping Amazon');
        return [];
    }

    try {
        console.log(`[AmazonAPI] Searching Amazon for: "${query}"`);

        const response = await axios.get('https://api.rainforestapi.com/request', {
            params: {
                api_key: apiKey,
                type: 'search',
                amazon_domain: 'amazon.com',
                search_term: query
            },
            timeout: 30000 // 30 second timeout
        });

        const results = response.data.search_results || [];
        console.log(`[AmazonAPI] Found ${results.length} Amazon results`);

        // Map to standardized product format
        const products = results
            .map(item => {
                // Try multiple ways to get the price
                let priceValue = 0;
                let priceString = '';

                // Check item.price object
                if (item.price) {
                    if (item.price.value) {
                        priceValue = item.price.value;
                        priceString = item.price.raw || `$${priceValue}`;
                    } else if (item.price.raw) {
                        const match = item.price.raw.match(/[\d,.]+/);
                        if (match) {
                            priceValue = parseFloat(match[0].replace(/,/g, ''));
                            priceString = item.price.raw;
                        }
                    }
                }

                // Fall back to prices array if available
                if (!priceValue && item.prices && item.prices.length > 0) {
                    const firstPrice = item.prices[0];
                    priceValue = firstPrice.value || 0;
                    priceString = firstPrice.raw || `$${priceValue}`;
                }

                // Skip items without valid prices
                if (!priceValue || priceValue <= 0) {
                    return null;
                }

                return {
                    title: item.title || 'Amazon Product',
                    price: priceString || `$${priceValue}`,
                    extracted_price: priceValue,
                    link: item.link || '#',
                    image: item.image || item.thumbnail || '',
                    source: 'Amazon',
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
                    delivery: item.delivery?.tagline || item.delivery || ''
                };
            })
            .filter(item => item !== null) // Remove null entries
            .slice(0, 3); // Limit to top 3 Amazon results

        console.log(`[AmazonAPI] Returning ${products.length} valid Amazon products`);
        return products;

    } catch (error) {
        console.error('[AmazonAPI] Error fetching Amazon data:', error.message);
        if (error.response?.data) {
            console.error('[AmazonAPI] Response:', JSON.stringify(error.response.data));
        }
        return []; // Return empty array on error, don't break the app
    }
};

module.exports = { getAmazonProducts };
