import connection from '../database/database.js';

async function getCategories(req, res) {
  try {
    const categories = await connection.query(`
        SELECT * FROM categories LIMIT 10
    `);
    res.send(categories.rows);
  } catch (e) {
    res.sendStatus(500);
  }
}

async function getTrends(req, res) {
  try {
    const trends = await connection.query('SELECT * FROM trends LIMIT 3');
    if (trends.rows < 3) {
      res.sendStatus(404);
      return;
    }

    const trend1 = await connection.query(`SELECT categories.name FROM trends_categories
      JOIN categories ON categories.id = trends_categories.category_id WHERE trends_categories.trend_id = $1 LIMIT 5`, [trends.rows[0].id]);
    const trend2 = await connection.query(`SELECT categories.name FROM trends_categories
      JOIN categories ON categories.id = trends_categories.category_id WHERE trends_categories.trend_id = $1 LIMIT 5`, [trends.rows[1].id]);
    const trend3 = await connection.query(`SELECT categories.name FROM trends_categories
      JOIN categories ON categories.id = trends_categories.category_id WHERE trends_categories.trend_id = $1 LIMIT 5`, [trends.rows[2].id]);

    res.send([
      {
        name: trends.rows[0].name,
        categories: trend1.rows.map((cat) => cat.name),
      },
      {
        name: trends.rows[1].name,
        categories: trend3.rows.map((cat) => cat.name),
      },
      {
        name: trends.rows[2].name,
        categories: trend2.rows.map((cat) => cat.name),
      },
    ]);
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

    const sale1 = await connection.query(`SELECT products.name FROM products_sales
      JOIN products ON products.id = products_sales.product_id WHERE products_sales.sales_id = $1 LIMIT 5`, [sales.rows[0].id]);
    const sale2 = await connection.query(`SELECT products.name FROM products_sales
      JOIN products ON products.id = products_sales.product_id WHERE products_sales.sales_id = $1 LIMIT 5`, [sales.rows[1].id]);
    const sale3 = await connection.query(`SELECT products.name FROM products_sales
      JOIN products ON products.id = products_sales.product_id WHERE products_sales.sales_id = $1 LIMIT 5`, [sales.rows[2].id]);
    res.send([
      {
        name: sales.rows[0].name,
        products: sale1.rows.map((cat) => cat.name),
      },
      {
        name: sales.rows[1].name,
        products: sale3.rows.map((cat) => cat.name),
      },
      {
        name: sales.rows[2].name,
        products: sale2.rows.map((cat) => cat.name),
      },
    ]);
  } catch (e) {
    res.sendStatus(500);
  }
}

export {
  getCategories,
  getTrends,
  getSales,
};