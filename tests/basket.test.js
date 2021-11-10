/* eslint-disable no-undef */
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app.js';
import connection from '../src/database/database.js';

describe('GET "/basket" ', () => {
  const token = '10f8c2d2-7115-4349-b124-e497f0b7f00f';

  beforeAll(async () => {
    const encriptedPassword = bcrypt.hashSync('1234567', 10);

    await connection.query(`INSERT INTO address (district, city, neighborhood, street, number) 
        VALUES ('RJ', 'new iguaçu', 'little factory', 'street michal fields', 87)`);

    const address = await connection.query('SELECT * FROM address');

    await connection.query(`INSERT INTO users (name, email, password, address_id, phone, cpf) 
        VALUES ('pedrin', 'oi@bol.com', '${encriptedPassword}', '${address.rows[0].id}', '21967431453', '18615158712')`);

    const users = await connection.query('SELECT * FROM users');
    const idUser = users.rows[0].id;

    await connection.query("INSERT INTO products (name, description, price, installments) VALUES  ('prod1', 'sou barato', 2.40, 3)");

    const products = await connection.query('SELECT * FROM products');
    const idProduct = products.rows[0].id;

    await connection.query("INSERT INTO colors (name) VALUES ('rosa')");
    const colors = await connection.query('SELECT * FROM colors');
    const idColor = colors.rows[0].id;

    await connection.query("INSERT INTO sizes (name) VALUES 'P'");
    const sizes = await connection.query('SELECT * FROM sizes');
    const idSize = sizes.rows[0].id;

    await connection.query(`INSERT INTO basket_products (product_id, user_id, size_id, color_id)
        VALUES (${idProduct}, ${idUser}, ${idSize}, ${idColor})`);
  });

  afterAll(async () => {
    await connection.query('DELETE FROM basket_products');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM sizes');
    await connection.query('DELETE FROM colors');
  });

  it('GET "/basket" returns 200 if valid token and has transactions', async () => {
    const result = await supertest(app)
      .get('/basket')
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual([{
      products: expect.any(Array),
    }]);
  });

  it('GET "/basket" returns 204 if valid token and no transactions', async () => {
    const result = await supertest(app)
      .get('/basket')
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(204);
    expect(result.body).toEqual({});
  });

  it('GET "/basket" returns 401 if no headers', async () => {
    const result = await supertest(app).get('/basket');
    expect(result.status).toEqual(401);
  });

  it('GET "/basket" returns 401 if invalid token', async () => {
    const result = await supertest(app)
      .get('/basket')
      .set('Authorization', 'Bearer kdjksadjadksd');
    expect(result.status).toEqual(401);
  });
});
