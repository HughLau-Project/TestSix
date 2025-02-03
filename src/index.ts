import express from 'express';

const app = express();
const port = 3333;

// 中間件來解析 JSON 請求體
app.use(express.json());

// 簡單的 GET 路由
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// 簡單的 POST 路由
app.post('/api/echo', (req, res) => {
  const data = req.body;
  res.json({ data });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
