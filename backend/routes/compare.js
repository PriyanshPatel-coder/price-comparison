const express = require('express');
const router = express.Router();
const { getPriceComparison } = require('../services/serpApi');

router.get('/', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const data = await getPriceComparison(q);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch price data', details: error.message });
    }
});

module.exports = router;
