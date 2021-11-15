import connection from '../database/database.js';

async function getHistory(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  try {
    const user = await connection.query(`
            SELECT * FROM sessions
            WHERE token = $1
    `, [token]);

    if (!user.rows.length) {
      res.sendStatus(401);
      return;
    }

    const result = await connection.query('SELECT * FROM shoppings WHERE user_id = $1', [user.rows[0].user_id]);

    if (!result.rows.length) {
      res.sendStatus(204);
      return;
    }

    const shoppings = result.rows;
    const response = [];

    const products = await connection.query('SELECT * FROM shopping_products;');
    shoppings.forEach((shopping) => {
      const resultProducts = products.rows.filter((prod) => prod.shopping_id === shopping.id);
      response.push({ ...shopping, products: resultProducts });
    });

    const productsInfo = await connection.query('SELECT * FROM products;');
    const colors = await connection.query('SELECT * FROM colors;');
    const sizes = await connection.query('SELECT * FROM sizes;');
    const images = await connection.query(`SELECT images.*, products_images.product_id
        FROM products_images JOIN images ON products_images.image_id = images.id;`);

    response.forEach((resp, i) => {
      response[i].products = resp.products.map((e) => ({
        id: e.id,
        name: productsInfo.rows.filter((prod) => prod.id === e.product_id)[0].name,
        price: productsInfo.rows.filter((prod) => prod.id === e.product_id)[0].price,
        color: colors.rows.filter((color) => color.id === e.color_id)[0].name,
        size: sizes.rows.filter((size) => size.id === e.size_id)[0].name,
        image: images.rows.filter((image) => image.product_id === e.product_id)[0].name,
        quantity: e.quantity,
      }));
    });

    res.send(response);
  } catch (error) {
    res.sendStatus(500);
  }
}

export default getHistory;
