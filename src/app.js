import express from 'express';
import cors from 'cors';
import { getCategories, getSales, getTrends } from './controllers/filters.js';
import { postSignUp, postSignIn } from './controllers/registration.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.get('/categories', (req, res) => getCategories(req, res));
app.get('/trends', (req, res) => getTrends(req, res));
app.get('/sales', (req, res) => getSales(req, res));

app.post('/sign-up', (req, res) => postSignUp(req, res));
app.post('/sign-in', (req, res) => postSignIn(req, res));

export default app;
