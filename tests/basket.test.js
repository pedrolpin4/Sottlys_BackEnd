/* eslint-disable no-undef */
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app.js';
import connection from '../src/database/database.js';

describe('GET "/basket" ', () => {
  const token = '10f8c2d2-7115-4349-b124-e497f0b7f00f';
  let productId;
  let colorId;
  let sizeId;
  let userId;

  beforeAll(async () => {
    const encriptedPassword = bcrypt.hashSync('1234567', 10);

    await connection.query(`INSERT INTO address (district, city, neighborhood, street, number) 
        VALUES ('RJ', 'new iguaçu', 'little factory', 'street michal fields', 87)`);

    const address = await connection.query('SELECT * FROM address');

    await connection.query(`INSERT INTO users (name, email, password, address_id, phone, cpf) 
        VALUES ('pedrin', 'oi@bol.com', '${encriptedPassword}', '${address.rows[0].id}', '21967431453', '18615158712')`);

    const users = await connection.query('SELECT * FROM users');
    const idUser = users.rows[0].id;
    userId = idUser;

    await connection.query(`INSERT INTO sessions (user_id, token) VALUES  (${idUser}, '${token}')`);

    await connection.query("INSERT INTO products (name, description, price, installments) VALUES  ('prod1', 'sou barato', 2.40, 3)");

    const products = await connection.query('SELECT * FROM products');
    const idProduct = products.rows[0].id;
    productId = idProduct;

    await connection.query("INSERT INTO colors (name) VALUES ('rosa')");
    const colors = await connection.query('SELECT * FROM colors');
    const idColor = colors.rows[0].id;
    colorId = idColor;

    await connection.query("INSERT INTO sizes (name) VALUES ('P')");
    const sizes = await connection.query('SELECT * FROM sizes');
    const idSize = sizes.rows[0].id;
    sizeId = idSize;

    await connection.query(`INSERT INTO basket_products (product_id, user_id, size_id, color_id)
    VALUES (${idProduct}, ${idUser}, ${idSize}, ${idColor})`);
  });

  afterEach(async () => {
    await connection.query('DELETE FROM basket_products');
  });

  afterAll(async () => {
    await connection.query('DELETE FROM basket_products');
    await connection.query('DELETE FROM products_images;');
    await connection.query("DELETE FROM products WHERE name = 'prod1'");
    await connection.query('DELETE FROM sizes');
    await connection.query('DELETE FROM colors');
  });

  it('GET "/basket" returns 200 if valid token and has products', async () => {
    const result = await supertest(app)
      .get('/basket')
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual(expect.any(Array));
  });

  it('GET "/basket" returns 204 if valid token and no products', async () => {
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

  it('PUT /quantity returns 401 if invalid token', async () => {
    const result = await supertest(app)
      .put('/quantity');
    expect(result.status).toEqual(401);
  });

  it('PUT /quantity returns 401 if invalid token', async () => {
    const result = await supertest(app)
      .put('/quantity')
      .set('Authorization', 'Bearer kdjksadjadksd');
    expect(result.status).toEqual(401);
  });

  it('PUT /quantity returns 200 if valid token', async () => {
    const result = await supertest(app)
      .put('/quantity')
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
  });

  it('DELETE /basket returns 401 if invalid token', async () => {
    const result = await supertest(app)
      .delete('/basket')
      .set('Authorization', 'Bearer kdjksadjadksd');
    expect(result.status).toEqual(401);
  });

  it('DELETE /basket returns 404 if valid token and invalid product_id', async () => {
    const result = await supertest(app)
      .delete('/basket')
      .send({
        productId: 1,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(404);
  });

  it('DELETE /basket returns 200 if valid token and valid product_id', async () => {
    await connection.query(`INSERT INTO basket_products (product_id, user_id, size_id, color_id)
      VALUES (${productId}, ${userId}, ${sizeId}, ${colorId})`);

    const result = await supertest(app)
      .delete('/basket')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
      });
    expect(result.status).toEqual(200);
  });
});
