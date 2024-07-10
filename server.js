require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const { json } = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();
app.use(json());

app.get('/', async (req, res) => {
    const text = 'write a function in javascript ?';
    const url = 'https://deepai.org/chat/text-generator';
    
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: 'networkidle2',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        // Fill in the textarea
        await page.evaluate((text) => {
            document.querySelector('textarea.chatbox').value = text;
        }, text);

        // Click the submit button
        await page.click('#chatSubmitButton');

        // Wait for the result to appear
        await page.waitForSelector('.markdownContainer p');


        // Extract the result
        const result = await page.evaluate(() => {
            return document.querySelector('.markdownContainer p').innerText;
        });

        console.log(result); // Prints the result

        await browser.close();
        
        res.json({ result });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
