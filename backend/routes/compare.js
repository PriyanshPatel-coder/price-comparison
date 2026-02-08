const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getPriceComparison } = require('../services/serpApi');
const { getAmazonProducts } = require('../services/amazonApi');

// GET /api/compare/suggestions?q=partialText
// Uses Google's Suggest API for real-time autocomplete (like Google Search)
router.get('/suggestions', async (req, res) => {
    const query = req.query.q || '';

    if (query.length < 2) {
        return res.json([]);
    }

    try {
        // Use Google's Suggest API (same as Google Search autocomplete)
        const response = await axios.get('https://suggestqueries.google.com/complete/search', {
            params: {
                client: 'firefox', // Returns clean JSON format
                q: query
            },
            timeout: 3000
        });

        // Google returns [query, [suggestions array]]
        const suggestions = response.data[1] || [];

        // Return top 8 suggestions
        res.json(suggestions.slice(0, 8));
    } catch (error) {
        console.error('[Suggestions] Error:', error.message);
        res.json([]); // Return empty on error
    }
});

// GET /api/compare?q=productName
router.get('/', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        // Fetch from both APIs in parallel for faster response
        // Use allSettled so one failure doesn't crash the entire request
        const results = await Promise.allSettled([
            getPriceComparison(q),
            getAmazonProducts(q)
        ]);

        const googleShoppingProducts = results[0].status === 'fulfilled' ? results[0].value : [];
        const amazonProducts = results[1].status === 'fulfilled' ? results[1].value : [];

        // Log errors if any occurred, but don't stop the request
        if (results[0].status === 'rejected') {
            console.error('[Compare] Google Shopping API Failed:', results[0].reason.message);
        }
        if (results[1].status === 'rejected') {
            console.error('[Compare] Amazon API Failed:', results[1].reason.message);
        }

        console.log(`[Compare] Google Shopping: ${googleShoppingProducts.length}, Amazon: ${amazonProducts.length}`);

        // Merge results and sort by price (lowest first)
        const allProducts = [...googleShoppingProducts, ...amazonProducts]
            .sort((a, b) => a.extracted_price - b.extracted_price);

        // Deduplicate by seller (keep cheapest per seller)
        const sellerMap = new Map();
        for (const product of allProducts) {
            const seller = product.source.toLowerCase();
            if (!sellerMap.has(seller) || product.extracted_price < sellerMap.get(seller).extracted_price) {
                sellerMap.set(seller, product);
            }
        }

        const finalProducts = Array.from(sellerMap.values())
            .sort((a, b) => a.extracted_price - b.extracted_price)
            .slice(0, 8); // Return top 8 results

        console.log(`[Compare] Final merged results: ${finalProducts.length}`);

        res.json(finalProducts);
    } catch (error) {
        console.error('[Compare] Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch price data', details: error.message });
    }
});

module.exports = router;
