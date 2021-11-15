/* eslint-disable max-len */
import connection from '../database/database.js';

async function getCategoryInfo(req, res) {
  const { id } = req.params;
  if (!Number(id)) {
    res.sendStatus(400);
    return;
  }

  try {
    const category = await connection.query('SELECT * FROM categories WHERE id = $1 LIMIT 60', [id]);
    res.send(category.rows);
  } catch (e) {
    res.sendStatus(500);
  }
}

export {
  // eslint-disable-next-line import/prefer-default-export
  getCategoryInfo,
};
