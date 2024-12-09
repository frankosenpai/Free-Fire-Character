import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/characters', async (req, res) => {
  try {
    const response = await fetch(`https://api.nexalo.xyz/free-fire?list&api=${process.env.API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching characters' });
  }
});

app.get('/api/character/:name', async (req, res) => {
  try {
    const response = await fetch(`https://api.nexalo.xyz/free-fire?info=${req.params.name}&api=${process.env.API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching character info' });
  }
});

app.get('/api/search/:query', async (req, res) => {
  try {
    const response = await fetch(`https://api.nexalo.xyz/free-fire?q=${req.params.query}&api=${process.env.API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching characters' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

