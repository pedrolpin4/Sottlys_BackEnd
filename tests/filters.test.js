/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';

describe('GET /filters', () => {
  beforeAll(async () => {
    await connection.query(`INSERT INTO categories (name) VALUES  ('cat1'), ('cat2'), ('cat3'), ('cat4'),
      ('cat5'), ('cat6'), ('cat7'), ('cat8'), ('cat9'), ('cat10'), ('cat11'), ('cat12')`);
    await connection.query("INSERT INTO sales (name) VALUES ('50% off em sapatos'), ('20% off em roupas de banho'), ('blusas a partir de R$39,90')");
    await connection.query(`INSERT INTO products (name, description, price, installments) VALUES  ('prod1', 'sou barato', 2.40, 3), ('prod2', 'sou barato', 2.40, 3), 
      ('prod3', 'sou barato', 2.40, 3), ('prod4', 'sou barato', 2.40, 3), ('prod5', 'sou barato', 2.40, 3), ('prod6', 'sou barato', 2.40, 3), ('prod7', 'sou barato', 2.40, 3), 
      ('prod8', 'sou barato', 2.40, 3), ('prod9', 'sou barato', 2.40, 3), ('prod10', 'sou barato', 2.40, 3), ('prod11', 'sou barato', 2.40, 3), ('prod12', 'sou barato', 2.40, 3), 
      ('prod13', 'sou barato', 2.40, 3)`);

    const products = await connection.query('SELECT * FROM products');
    const sales = await connection.query('SELECT * FROM sales');

    const idProduct = products.rows[0].id;
    const idSale = sales.rows[0].id;

    await connection.query(`INSERT INTO products_sales (product_id, sales_id, new_price) VALUES
      (${idProduct}, ${idSale}, 1.20), (${idProduct + 1}, ${idSale + 1}, 1.20),(${idProduct + 2}, ${idSale + 2}, 1.20)`);
  });

  afterAll(async () => {
    await connection.query('DELETE FROM products_sales');
    await connection.query('DELETE FROM sales');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM categories');
  });

  it('GET /categories returns the categories first 60 categories', async () => {
    const result = await supertest(app)
      .get('/categories');
    expect(result.body.length).toBeLessThanOrEqual(60);
  });

  it('GET /sales returns 3 sales and 5 categories', async () => {
    const result = await supertest(app)
      .get('/sales');
    expect(result.body.length).toEqual(3);
    expect(result.body[0].products.length).toBeLessThanOrEqual(5);
    expect(result.body[0].name).toEqual('50% off em sapatos');
  });
});
