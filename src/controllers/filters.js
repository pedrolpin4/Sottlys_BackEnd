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
    const sales = await connection.query('SELECT * FROM sales LIMIT 16');
    res.send(sales.rows);
  } catch (e) {
    res.sendStatus(500);
  }
}

export {
  getCategories,
  getSales,
  getTrends,
};
