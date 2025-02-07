// src/index.ts
import express from 'express';
import CsvManager from './CsvManager';

const app = express();
const port = 3333;

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.post('/api/echo', (req, res) => {
  const data = req.body;
  res.json({ data });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);

  const csvManager = new CsvManager();
  csvManager.cal();
});
