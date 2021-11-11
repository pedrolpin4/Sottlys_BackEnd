/* eslint-disable max-len */
import connection from '../database/database.js';

async function getCategories(req, res) {
  try {
    const categories = await connection.query(`
        SELECT * FROM categories LIMIT 60
    `);
    res.send([...categories.rows]);
  } catch (e) {
    res.sendStatus(500);
  }
}

async function getTrends(req, res) {
  try {
    const trends = await connection.query("SELECT * FROM categories WHERE is_trend = 't' LIMIT 6");

    res.send([...trends.rows]);
  } catch (e) {
    res.sendStatus(500);
  }
}

async function getSales(req, res) {
  try {
    const sales = await connection.query('SELECT * FROM sales LIMIT 3');
    if (sales.rows < 3) {
      res.sendStatus(404);
      return;
    }

    const sale1 = await connection.query(`SELECT products.name, products.id FROM products_sales
      JOIN products ON products.id = products_sales.product_id WHERE products_sales.sales_id = $1 LIMIT 5`, [sales.rows[0].id]);
    const sale2 = await connection.query(`SELECT products.name, products.id FROM products_sales
      JOIN products ON products.id = products_sales.product_id WHERE products_sales.sales_id = $1 LIMIT 5`, [sales.rows[1].id]);
    const sale3 = await connection.query(`SELECT products.name, products.id FROM products_sales
      JOIN products ON products.id = products_sales.product_id WHERE products_sales.sales_id = $1 LIMIT 5`, [sales.rows[2].id]);
    res.send([
      {
        name: sales.rows[0].name,
        products: sale1.rows.map((prod) => ({
          name: prod.name,
          id: prod.id,
        })),
      },
      {
        name: sales.rows[1].name,
        products: sale2.rows.map((prod) => ({
          name: prod.name,
          id: prod.id,
        })),
      },
      {
        name: sales.rows[2].name,
        products: sale3.rows.map((prod) => ({
          name: prod.name,
          id: prod.id,
        })),
      },
    ]);
  } catch (e) {
    res.sendStatus(500);
  }
}

export {
  getCategories,
  getSales,
  getTrends,
};
