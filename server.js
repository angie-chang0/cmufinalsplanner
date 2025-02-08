const express = require('express');
const openai = require('openai');
const server = express();

server.get('/', (req, res) => {
    res.send('hello root node');
});

const apiRoute = require('./routes/api/create-calendar-link');

server.use('/api', apiRoute);

server.use(express.json());

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

