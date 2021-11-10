/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';

describe('GET /main-categories', () => {
  it('Should returns the first 6 categories', async () => {
    const result = await supertest(app)
      .get('/main-categories');
    expect(result.body.length).toBeLessThanOrEqual(6);
  });
});

describe('GET /products-category/:id', () => {
  let id = '';
  beforeAll(async () => {
    await connection.query(`INSERT INTO categories (name) VALUES ('cat1');`);
    await connection.query(`INSERT INTO products (name, description, price, installments) VALUES ('mais uma blusa', 'blusa super confortavel e suave', 150.00, 6);`);

    const category = await connection.query(`SELECT * FROM categories WHERE name = 'cat1';`);
    const idCategory = category.rows[0].id;
    const product = await connection.query(`SELECT * FROM products WHERE name = 'mais uma blusa';`);
    const idProduct = product.rows[0].id;

    await connection.query(`INSERT INTO products_categories (product_id, category_id) VALUES ($1,$2);`, [idProduct, idCategory]);
    id = idCategory;
  });

  afterAll(async () => {
    await connection.query('DELETE FROM products_categories WHERE category_id =$1 ', [id]);
    await connection.query(`DELETE FROM products WHERE name = 'mais uma blusa';`);
    await connection.query('DELETE FROM categories WHERE id =$1', [id]);
    id = '';
  });

  it('Should returns the first 16 products with de id category', async () => {
    const result = await supertest(app)
      .get('/products-category/1');
    expect(result.body.length).toBeLessThanOrEqual(16);
  });

  it('Should returns 400 if id is not a number', async () => {
    const result = await supertest(app)
      .get('/products-category/l');
    expect(result.status).toEqual(400);
  });

  it('Should array images if there is a product', async () => {
    const result = await supertest(app)
      .get(`/products-category/${id}`);
    expect(result.body[0].images).toEqual([]);
  });
});
