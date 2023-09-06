const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the Express server');
});

app.post('/get_answer', async (req, res) => {
    try {
        const userQuestion = req.body.userQuestion;

        if (!userQuestion) {
            return res.status(400).json({ error: 'No question provided' });
        }

        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                prompt: userQuestion,
                max_tokens: 50,
                temperature: 0.7,
                model: 'text-davinci-003',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use the API key from the environment variable
                },
            }
        );

        let aiResponse = response.data.choices[0].text;

        // Replace "AI Response:" with "Milnix jr:"
        aiResponse = aiResponse.replace('AI Response:', 'Milnix jr:');

        res.json({ aiResponse });
    } catch (error) {
        if (error.response) {
            console.error('API Response Error:', error.response.status, error.response.data);
            res.status(error.response.status).json({ error: 'API Response Error' });
        } else if (error.request) {
            console.error('No response from server:', error.request);
            res.status(500).json({ error: 'No response from server' });
        } else {
            console.error('An error occurred:', error.message);
            res.status(500).json({ error: 'An error occurred' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
