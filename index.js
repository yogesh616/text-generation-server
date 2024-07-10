require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const url = `https://www.google.com/search?q=${encodeURIComponent(prompt)}`;
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        const $ = cheerio.load(data);
        const result = $('div.BNeawe').first().text();
        
        console.log(result); // Prints the first result
        
        res.json({ result });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
