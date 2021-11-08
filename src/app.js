import express from 'express';
import cors from 'cors';
import getCategories from './controllers/filters';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.get('/categories', (req, res) => getCategories(req, res));

export default app;
