/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { createUser } from './factories/userFactory.js';
import { createProduct, deleteProduct } from './factories/productFactory';

describe('POST /basket', () => {
  let user;
  let product;
  beforeAll(async () => {
    user = await createUser();
    product = await createProduct();
  });
  afterAll(async () => {
    await connection.query('DELETE FROM basket_products');
    await deleteProduct();
  });

  it('Should returns 401 when receive an invalid token ', async () => {
    const result = await supertest(app)
      .post('/basket')
      .set('Authorization', 'Bearer 1222')
      .send({
        userId: 1,
        productId: product.idProduct,
        colorId: product.idColor,
        sizeId: product.idSize,
      });
    expect(result.status).toEqual(401);
  });

  it('Should returns 400 if receive an non-existent id', async () => {
    const result = await supertest(app)
      .post('/basket')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        userId: user.id,
        productId: product.idProduct,
        colorId: 100000000000000001,
        sizeId: product.idSize,
      });
    expect(result.status).toEqual(400);
  });

  it('Should returns 201 when item insert into basket', async () => {
    const result = await supertest(app)
      .post('/basket')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        userId: user.id,
        productId: product.idProduct,
        colorId: product.idColor,
        sizeId: product.idSize,
      });
    expect(result.status).toEqual(201);
  });
});
