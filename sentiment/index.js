require('dotenv').config();
const express = require('express');
const natural = require('natural');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");

app.post('/sentiment', (req, res) => {
    const { sentence } = req.query;
    if (!sentence) {
        return res.status(400).send({ error: 'No sentence provided' });
    }
    const words = sentence.split(' ');
    const score = analyzer.getSentiment(words);
    let sentiment = "neutral";
    if (score < 0) {
        sentiment = "negative";
    } else if (score > 0.33) {
        sentiment = "positive";
    }
    res.status(200).json({ sentiment, score });
});

app.listen(port, () => {
    console.log(`Sentiment service running on port ${port}`);
});
