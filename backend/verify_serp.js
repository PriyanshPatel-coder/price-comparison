require('dotenv').config();
const axios = require('axios');

const key = (process.env.SERPAPI_KEY || '').trim();
console.log('ENV Key:', key);
console.log('Key Length:', key.length);

if (!key) {
    console.error('Error: No API Key found in env.');
    process.exit(1);
}

console.log('Testing connection to SerpAPI...');

axios.get('https://www.searchapi.io/api/v1/search', {
    params: {
        engine: 'google_shopping',
        q: 'coffee',
        api_key: key
    }
})
    .then(res => {
        console.log('SUCCESS: API Key is valid!');
        console.log(`Found ${res.data.shopping_results?.length || 0} results.`);
    })
    .catch(err => {
        console.error('FAILURE: API Request Failed.');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Message:', JSON.stringify(err.response.data));
        } else {
            console.error('Error:', err.message);
        }
    });
