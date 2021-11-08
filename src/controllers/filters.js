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

export default getCategories;
