import connection from '../database/database.js';

export default async function getSearchedItems(req, res) {
  const {
    type,
    content,
  } = req.query;

  const substring = `%${content.toLowerCase()}%`;

  try {
    if (type === 'produtos') {
      const result = await connection.query('SELECT * FROM products WHERE LOWER(name) LIKE $1 ORDER BY name', [substring]);
      if (!result.rowCount) {
        res.sendStatus(204);
        return;
      }

      res.send(result.rows);
      return;
    }

    if (type === 'categorias') {
      const result = await connection.query('SELECT * FROM categories WHERE LOWER(name) LIKE $1 ORDER BY name', [substring]);
      if (!result.rowCount) {
        res.sendStatus(204);
        return;
      }

      res.send(result.rows);
      return;
    }

    if (type === 'tendencias') {
      const result = await connection.query("SELECT * FROM categories WHERE LOWER(name) LIKE $1 AND is_trend = 't' ORDER BY name", [substring]);
      if (!result.rowCount) {
        res.sendStatus(204);
        return;
      }

      res.send(result.rows);
      return;
    }

    if (type === 'promocoes') {
      const result = await connection.query('SELECT * FROM sales WHERE LOWER(name) LIKE $1 ORDER BY name', [substring]);
      if (!result.rowCount) {
        res.sendStatus(204);
        return;
      }

      res.send(result.rows);
      return;
    }
  } catch (error) {
    res.sendStatus(500);
  }
}
