/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';

describe('GET /categories', () => {
  beforeAll(async () => {
    await connection.query(`INSERT INTO categories (name) VALUES  ($1), ($2), ($3), ($4), ($5), ($6), 
      ($7), ($8), ($9), ($10), ($11), ($12), ($13)`, [`cat${1}`, `cat${2}`, `cat${3}`, `cat${4}`,
      `cat${5}`, `cat${6}`, `cat${7}`, `cat${8}`, `cat${9}`, `cat${10}`, `cat${11}`, `cat${12}`, `cat${13}`]);
  });

  afterAll(async () => {
    await connection.query('DELETE FROM categories');
  });

  it('should return the categories first 10 categories', async () => {
    const result = await supertest(app)
      .get('/categories');
    expect(result.body.length).toEqual(10);
  });
});

describe('GET /categories', () => {
  beforeAll(async () => {
    await connection.query(`INSERT INTO products ()
    VALUES`);
  });

  afterAll(async () => {
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM products_categories');
  });

  it('should return the categories first 10 categories', async () => {
    const result = await supertest(app)
      .get('/categories');
    expect(result.body.length).toEqual(10);
  });
});

// `SELECT products.name FROM products JOIN products_categories
// ON product.id = products_categories.product_id WHERE products_categories.name = 'promoção'`
