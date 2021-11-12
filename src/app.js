import express from 'express';
import cors from 'cors';
import { getCategories, getSales, getTrends } from './controllers/filters.js';
import { getMainCategories, getProductsByCategory } from './controllers/homePosts.js';
import { postSignUp, postSignIn } from './controllers/registration.js';
import { deleteQuantity, getBasket, updateQuantity } from './controllers/basket.js';
import postBasket from './controllers/postBasket.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.get('/categories', (req, res) => getCategories(req, res));
app.get('/trends', (req, res) => getTrends(req, res));
app.get('/sales', (req, res) => getSales(req, res));

app.get('/main-categories', (req, res) => getMainCategories(req, res));
app.get('/products-category/:id', (req, res) => getProductsByCategory(req, res));

app.get('/basket', (req, res) => getBasket(req, res));
app.post('/basket', (req, res) => postBasket(req, res));
app.put('/quantity', (req, res) => updateQuantity(req, res));
app.delete('/basket', (req, res) => deleteQuantity(req, res));

app.post('/sign-up', (req, res) => postSignUp(req, res));
app.post('/sign-in', (req, res) => postSignIn(req, res));

export default app;
