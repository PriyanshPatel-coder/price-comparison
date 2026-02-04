const axios = require('axios');
require('dotenv').config();

const getPriceComparison = async (query) => {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    throw new Error('SERPAPI_KEY is missing in .env file');
  }

  // Debug log to confirm key is loaded (prints first 5 chars)
  console.log(`[Service] Using Key: ${apiKey.substring(0, 5)}...`);

  try {
    console.log(`[Service] Fetching prices for: ${query} from SearchApi.io`);

    // Using SearchApi.io endpoint
    const response = await axios.get('https://www.searchapi.io/api/v1/search', {
      params: {
        engine: 'google_shopping',
        q: query,
        api_key: apiKey,
        location: 'United States',
        hl: 'en'
      }
    });

    // Log the keys to verify structure
    console.log('[Service] Response Keys:', Object.keys(response.data));

    const results = response.data.shopping_results || [];
    console.log(`[Service] Found ${results.length} items.`);

    // Map and sort results
    const products = results.map(item => ({
      title: item.title,
      price: item.price,
      // Fallback for extracted_price if not present
      extracted_price: item.extracted_price || (item.price ? parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) : 0),
      link: item.product_link || item.link,
      image: item.thumbnail,
      source: item.source,
      delivery: item.delivery
    })).sort((a, b) => a.extracted_price - b.extracted_price);

    return products;
  } catch (error) {
    console.error('[Service] Error fetching data:', error.message);
    if (error.response) {
      console.error('[Service] API Error Details:', JSON.stringify(error.response.data));
    }
    throw error;
  }
};

module.exports = { getPriceComparison };
