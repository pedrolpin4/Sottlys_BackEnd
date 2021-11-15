import connection from '../database/database.js';
import { basketValidation } from '../validations/joiValidations.js';

export default async function postBasket(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  const {
    userId,
    productId,
    colorId,
    sizeId,
    quantity,
  } = req.body;

  const validation = basketValidation.validate(req.body);
  if (validation.error) {
    res.status(400).send({
      message: validation.error.details[0].message,
    });
    return;
  }

  try {
    const user = await connection.query('SELECT * FROM sessions WHERE token = $1;', [token]);
    if (user.rowCount === 0) {
      res.sendStatus(401);
      return;
    }

    const products = await connection.query('SELECT * FROM products WHERE id = $1;', [productId]);
    if (products.rowCount === 0) {
      res.sendStatus(400);
      return;
    }

    const basket = await connection.query('SELECT * FROM basket_products WHERE product_id = $1;', [productId]);

    if (basket.rowCount !== 0) {
      const newQuantity = (basket.rows[0].quantity) + 1;
      await connection.query('UPDATE basket_products SET quantity = $1 WHERE product_id = $2;', [quantity || newQuantity, productId]);
      res.sendStatus(200);
      return;
    }

    const colors = await connection.query('SELECT * FROM colors WHERE id = $1;', [colorId]);
    const sizes = await connection.query('SELECT * FROM sizes WHERE id = $1;', [sizeId]);

    if (colors.rowCount === 0 || sizes.rowCount === 0) {
      res.sendStatus(400);
      return;
    }

    await connection.query('INSERT INTO basket_products (user_id, product_id, color_id, size_id, quantity) VALUES ($1, $2, $3, $4, $5);', [userId, productId, colorId, sizeId, quantity || 1]);
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
}
