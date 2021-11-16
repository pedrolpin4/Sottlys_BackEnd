import connection from '../database/database.js';

export default async function getSearchedItems(req, res) {
  const {
    searchType,
    searchContent,
  } = req.body;

  const substring = `%${searchContent}%`;

  try {
    if (searchType === 'Produtos') {
      const result = await connection.query('SELECT * FROM products WHERE name LIKE $1 ORDER BY name', [substring]);
      if (!result.rowCount) {
        res.sendStatus(204);
        return;
      }

      res.send(result.rows);
      return;
    }

    if (searchType === 'Categorias') {
      const result = await connection.query('SELECT * FROM categories WHERE name LIKE $1 ORDER BY name', [substring]);
      if (!result.rowCount) {
        res.sendStatus(204);
        return;
      }

      res.send(result.rows);
      return;
    }

    if (searchType === 'Promoções') {
      const result = await connection.query('SELECT * FROM sales WHERE name LIKE $1 ORDER BY name', [substring]);
      if (!result.rowCount) {
        res.sendStatus(204);
        return;
      }

      res.send(result.rows);
      return;
    }

    await connection.query('SELECT * FROM products');
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}
