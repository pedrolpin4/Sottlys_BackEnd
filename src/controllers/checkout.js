import connection from '../database/database.js';

export default async function postPayment(req, res) {
  res.sendStatus(200);
  await connection.query('SELECT * FROM shoppings');
}
