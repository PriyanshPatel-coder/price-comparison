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

    // Map and sort results with improved data extraction
    const products = results.map(item => {
      // Better source/store extraction
      let source = item.source || item.store || item.merchant || item.seller || 'Online Store';

      // Better price extraction
      let priceValue = 0;
      let priceString = '';

      if (item.extracted_price) {
        priceValue = item.extracted_price;
        priceString = item.price || `₹${priceValue}`;
      } else if (item.price) {
        // Try to extract number from price string
        const priceStr = item.price.toString();
        const priceMatch = priceStr.match(/[\d,]+\.?\d*/);
        if (priceMatch) {
          priceValue = parseFloat(priceMatch[0].replace(/,/g, ''));
          priceString = priceStr;
        }
      }

      // Logo mapping
      let logo = '';
      const lowerSource = source.toLowerCase();

      if (lowerSource.includes('amazon')) logo = 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg';
      else if (lowerSource.includes('flipkart')) logo = 'https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg';
      else if (lowerSource.includes('croma')) logo = 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Croma_Logo.png';
      else if (lowerSource.includes('reliance')) logo = 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg';
      else if (lowerSource.includes('myntra')) logo = 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Myntra_logo.png';
      else if (lowerSource.includes('nike')) logo = 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg';
      else logo = item.thumbnail || '';

      return {
        title: item.title || 'Product',
        price: priceString || `₹${priceValue}`,
        extracted_price: priceValue,
        link: item.product_link || item.link || '#',
        image: item.thumbnail || '',
        source: source,
        logo: logo,
        delivery: item.delivery || ''
      };
    })
      .filter(product => product.extracted_price > 0) // Remove items without valid prices
      .sort((a, b) => a.extracted_price - b.extracted_price)
      .slice(0, 5); // Return only top 5 lowest prices

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
