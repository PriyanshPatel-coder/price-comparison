const express = require('express');
const cors = require('cors');
require('dotenv').config();

const compareRouter = require('./routes/compare');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/compare', compareRouter);

app.get('/', (req, res) => {
    res.send('Price Comparison API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
