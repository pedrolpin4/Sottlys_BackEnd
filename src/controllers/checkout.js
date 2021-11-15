import connection from '../database/database.js';

export default async function postPayment(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  const {
    installments,
    paymentMethod,
    deliveryFee,
  } = req.body;

  try {
    const user = await connection.query('SELECT * FROM sessions WHERE token = $1;', [token]);
    if (user.rowCount === 0) {
      res.sendStatus(401);
      return;
    }

    const products = await connection.query('SELECT * FROM basket_products WHERE user_id = $1', [user.rows[0].user_id]);
    const date = new Date();

    await connection.query(`INSERT INTO shoppings (user_id, date, installments, payment_method, delivery_fee)
        VALUES ($1, $2, $3, $4, $5)`, [user.rows[0].user_id, date, installments, paymentMethod, deliveryFee]);

    const shopping = await connection.query('SELECT * FROM shoppings WHERE date = $1 AND user_id = $2', [date, user.rows[0].user_id]);

    let reqQuery = 'INSERT INTO shopping_products (shopping_id, product_id, color_id, size_id, quantity) VALUES ';

    products.rows.forEach((e, i) => {
      if (i !== (products.rows.length - 1)) {
        reqQuery += `('${shopping.rows[0].id}', '${e.product_id}', '${e.color_id}', '${e.size_id}', '${e.quantity}'), `;
        return;
      }

      reqQuery += `('${shopping.rows[0].id}', '${e.product_id}', '${e.color_id}', '${e.size_id}', '${e.quantity}')`;
    });

    await connection.query(reqQuery);
    await connection.query('DELETE FROM basket_products WHERE user_id = $1', [user.rows[0].user_id]);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}
