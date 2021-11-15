import connection from '../database/database.js';

async function getMainCategories(req, res) {
  try {
    const categories = await connection.query(`
        SELECT * FROM categories ORDER BY id LIMIT 6;
      `);
    res.send(categories.rows);
  } catch (e) {
    res.sendStatus(500);
  }
}

async function getProductsByCategory(req, res) {
  const { id } = req.params;
  if (!Number(id)) {
    res.sendStatus(400);
    return;
  }

  try {
    const products = await connection.query(`
            SELECT products.*, products_categories.category_id 
                FROM products 
            JOIN products_categories 
                ON products.id = products_categories.product_id 
            WHERE products_categories.category_id = $1 ORDER BY id LIMIT 60;
        `, [id]);

    const images = await connection.query('SELECT images.*, products_images.product_id FROM images JOIN products_images ON images.id = products_images.image_id;');
    const colors = await connection.query('SELECT colors.*, products_colors.product_id FROM colors JOIN products_colors ON colors.id = products_colors.color_id;');
    const sizes = await connection.query('SELECT sizes.*, products_size.product_id FROM sizes JOIN products_size ON sizes.id = products_size.size_id;');

    const newArray = products.rows.map((product) => {
      const newimages = images.rows.filter((image) => image.product_id === product.id);
      const newcolors = colors.rows.filter((color) => color.product_id === product.id);
      const newsizes = sizes.rows.filter((size) => size.product_id === product.id);

      return ({
        ...product,
        images: newimages,
        colors: newcolors,
        sizes: newsizes,
      });
    });

    res.send(newArray);
  } catch (e) {
    res.sendStatus(500);
  }
}

export {
  getMainCategories,
  getProductsByCategory,
};
