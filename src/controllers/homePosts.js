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

  try {
    const products = await connection.query(`
            SELECT products.*, products_categories.category_id 
                FROM products 
            JOIN products_categories 
                ON products.id = products_categories.product_id 
            WHERE products_categories.category_id = $1 ORDER BY id LIMIT 16;
        `, [id]);

    const images = await connection.query(`
            SELECT images.*, products_images.product_id FROM images JOIN products_images ON images.id = products_images.image_id;
            `);

    const newArray = products.rows.map((product) => {
      const imagesProduct = [];
      images.rows.forEach((img) => {
        if (product.id === img.product_id) {
          imagesProduct.push(img);
        }
      });
      return (
        {
          ...product,
          images: imagesProduct,
        }
      );
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
