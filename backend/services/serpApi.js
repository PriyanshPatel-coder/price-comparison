const axios = require('axios');
require('dotenv').config();

// ============================================================
// TRUSTED SELLERS CONFIGURATION
// ============================================================

/**
 * Whitelist of trusted, reputable US sellers.
 * Only products from these sellers will be returned.
 */
const TRUSTED_SELLERS = [
    // Major Retailers
    'amazon', 'ebay', 'walmart', 'best buy', 'bestbuy', 'target', 'costco',

    // Department Stores
    'macys', "macy's", 'nordstrom', 'kohls', "kohl's", 'bloomingdales', 'jcpenney',

    // Sporting Goods
    'dicks sporting goods', 'dick\'s', 'foot locker', 'champs sports', 'rei',
    'academy sports', 'big 5', 'fanatics',

    // Brand Official Stores (Shoes/Apparel)
    'nike', 'adidas', 'puma', 'reebok', 'new balance', 'under armour', 'asics',
    'converse', 'vans', 'crocs', 'timberland', 'skechers', 'hoka', 'brooks',

    // Electronics & Home
    'b&h', 'newegg', 'wayfair', 'home depot', 'lowes', 'staples', 'office depot',
    'gamestop', 'dell', 'hp', 'lenovo', 'apple', 'samsung', 'sony', 'lg'
];

/**
 * Normalizes seller name for consistent matching.
 * Removes domains, special characters, and standardizes casing.
 * @param {string} source - Raw seller/source name from API
 * @returns {string} - Normalized seller name
 */
const normalizeSeller = (source) => {
    if (!source) return '';
    return source
        .toLowerCase()
        .replace(/\.com|\.org|\.net|\.co|www\./g, '') // Remove domain parts
        .replace(/[^a-z0-9\s]/g, '')                   // Remove special chars
        .trim();
};

/**
 * Checks if a seller is in the trusted whitelist.
 * @param {string} source - Raw seller/source name
 * @returns {boolean} - True if seller is trusted
 */
const isTrustedSeller = (source) => {
    const normalized = normalizeSeller(source);
    return TRUSTED_SELLERS.some(seller => normalized.includes(seller));
};

/**
 * Deduplicates products by seller, keeping only the cheapest per seller.
 * @param {Array} products - Array of product objects
 * @returns {Array} - Deduplicated array with one product per seller
 */
const deduplicateBySeller = (products) => {
    const sellerMap = new Map();

    for (const product of products) {
        const normalizedSeller = normalizeSeller(product.source);
        const existing = sellerMap.get(normalizedSeller);

        // Keep only if no existing entry OR this one is cheaper
        if (!existing || product.extracted_price < existing.extracted_price) {
            sellerMap.set(normalizedSeller, product);
        }
    }

    return Array.from(sellerMap.values());
};

// ============================================================
// MAIN API FUNCTION
// ============================================================

const getPriceComparison = async (query) => {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
        throw new Error('SERPAPI_KEY is missing in .env file');
    }

    console.log(`[Service] Using Key: ${apiKey.substring(0, 5)}...`);

    try {
        console.log(`[Service] Fetching prices for: "${query}" from SearchApi.io`);

        // Fetch from SearchApi.io
        const response = await axios.get('https://www.searchapi.io/api/v1/search', {
            params: {
                engine: 'google_shopping',
                q: query,
                api_key: apiKey,
                location: 'United States',
                hl: 'en'
            }
        });

        console.log('[Service] Response Keys:', Object.keys(response.data));

        const results = response.data.shopping_results || [];
        console.log(`[Service] Raw results from API: ${results.length} items`);

        // Step 1: Map raw results to product objects
        const allProducts = results.map(item => {
            let source = item.source || item.store || item.merchant || item.seller || 'Unknown';

            // Price extraction
            let priceValue = 0;
            let priceString = '';

            if (item.extracted_price) {
                priceValue = item.extracted_price;
                priceString = item.price || `$${priceValue}`;
            } else if (item.price) {
                const priceStr = item.price.toString();
                const priceMatch = priceStr.match(/[\d,]+\.?\d*/);
                if (priceMatch) {
                    priceValue = parseFloat(priceMatch[0].replace(/,/g, ''));
                    priceString = priceStr;
                }
            }

            // Logo mapping for trusted sellers
            let logo = '';
            const lowerSource = source.toLowerCase();

            if (lowerSource.includes('amazon')) logo = 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg';
            else if (lowerSource.includes('ebay')) logo = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg';
            else if (lowerSource.includes('walmart')) logo = 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg';
            else if (lowerSource.includes('best buy') || lowerSource.includes('bestbuy')) logo = 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg';
            else if (lowerSource.includes('target')) logo = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg';
            else if (lowerSource.includes('costco')) logo = 'https://upload.wikimedia.org/wikipedia/commons/5/59/Costco_Wholesale_logo_2010-10-26.svg';
            else logo = item.thumbnail || '';

            return {
                title: item.title || 'Product',
                price: priceString || `$${priceValue}`,
                extracted_price: priceValue,
                link: item.product_link || item.link || '#',
                image: item.thumbnail || '',
                source: source,
                logo: logo,
                delivery: item.delivery || ''
            };
        });

        // Step 2: Filter out products without valid prices
        const validPriceProducts = allProducts.filter(p => p.extracted_price > 0);
        console.log(`[Service] Products with valid prices: ${validPriceProducts.length}`);

        // Step 3: Filter to ONLY trusted sellers
        const trustedProducts = validPriceProducts.filter(p => isTrustedSeller(p.source));
        console.log(`[Service] Products from TRUSTED sellers: ${trustedProducts.length}`);

        // Step 4: Deduplicate - keep only cheapest per seller
        const dedupedProducts = deduplicateBySeller(trustedProducts);
        console.log(`[Service] After deduplication: ${dedupedProducts.length} unique sellers`);

        // Step 5: Sort by price (lowest first) and limit
        const finalProducts = dedupedProducts
            .sort((a, b) => a.extracted_price - b.extracted_price)
            .slice(0, 6); // Return up to 6 trusted sellers

        console.log(`[Service] Final result: ${finalProducts.length} products`);

        return finalProducts;
    } catch (error) {
        console.error('[Service] Error fetching data:', error.message);
        if (error.response) {
            console.error('[Service] API Error Details:', JSON.stringify(error.response.data));
        }
        throw error;
    }
};

module.exports = { getPriceComparison };
