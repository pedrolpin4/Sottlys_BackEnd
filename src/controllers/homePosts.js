import connection from '../database/database.js';

async function getMainCategories(req, res) {
  try {
    const categories = await connection.query(`
          SELECT * FROM categories LIMIT 6;
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
            WHERE products_categories.category_id = $1;
        `, [id]);
    res.send(products.rows);
  } catch (e) {
    res.sendStatus(500);
  }
}

export {
  getMainCategories,
  getProductsByCategory,
};
