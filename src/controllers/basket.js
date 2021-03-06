import connection from '../database/database.js';

async function getBasket(req, res) {
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

    const result = await connection.query(`
            SELECT basket_products.* FROM sessions
            JOIN basket_products
            ON sessions.user_id = basket_products.user_id
            WHERE sessions.token = $1
    `, [token]);

    if (!result.rows.length) {
      res.sendStatus(204);
      return;
    }

    const products = await connection.query('SELECT * FROM products;');
    const colors = await connection.query('SELECT * FROM colors;');
    const sizes = await connection.query('SELECT * FROM sizes;');
    const images = await connection.query(`SELECT images.*, products_images.product_id FROM products_images JOIN images
      ON products_images.image_id = images.id;`);

    const basket = result.rows.map((e) => (
      {
        product: products.rows.filter((prod) => prod.id === e.product_id)[0],
        colors: colors.rows.filter((color) => color.id === e.color_id)[0],
        size: sizes.rows.filter((size) => size.id === e.size_id)[0],
        image: images.rows.filter((image) => image.product_id === e.product_id)[0],
        quantity: e.quantity,
      }
    ));
    const salesProducts = await connection.query('SELECT * FROM products_sales;');
    const newBasket = basket.map((e) => {
      const newArray = salesProducts.rows.filter((prod) => prod.product_id === e.product.id);
      if (newArray.length !== 0) {
        return ({
          ...e,
          product: {
            ...e.product,
            price: newArray[0].new_price,
          },
        });
      }
      return ({ ...e });
    });

    res.send(newBasket);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function updateQuantity(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  const {
    productId,
    colorId,
    sizeId,
    quantity,
  } = req.body;

  try {
    const user = await connection.query(`
            SELECT * FROM sessions
            WHERE token = $1
        `, [token]);

    if (!user.rows.length) {
      res.sendStatus(401);
      return;
    }

    await connection.query(`UPDATE basket_products SET quantity = $1
      WHERE product_id = $2 AND color_id = $3 AND size_id = $4`, [quantity, productId, colorId, sizeId]);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function deleteQuantity(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const {
    productId,
    colorId,
    sizeId,
  } = req.body;

  try {
    const user = await connection.query(`
            SELECT * FROM sessions
            WHERE token = $1
        `, [token]);

    if (!user.rows.length) {
      res.sendStatus(401);
      return;
    }

    const products = await connection.query('SELECT * FROM basket_products WHERE product_id = $1 AND color_id = $2 AND size_id = $3', [productId, colorId, sizeId]);
    if (!products.rowCount) {
      res.sendStatus(404);
      return;
    }

    await connection.query('DELETE FROM basket_products WHERE product_id = $1 AND color_id = $2 AND size_id = $3', [productId, colorId, sizeId]);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}

export {
  getBasket,
  updateQuantity,
  deleteQuantity,
};
