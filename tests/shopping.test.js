/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';

describe('POST/GET shoppings', () => {
  // beforeAll(async () => {

  // });

  // afterEach(async () => {
  //   await connection.query('DELETE FROM shopping_products');
  //   await connection.query('DELETE FROM shoppings');
  // });

  // it('POST /checkout should returns 200 if valid fields and valid token', async () => {
  //   const body = {
  //     installments: 6,
  //     deliveryFee: 32,
  //     paymentMethod: 'PIX',
  //   };
  //   const result = await supertest(app)
  //     .post('/checkout')
  //     .send(body)
  //     .set('Authorization', 'Bearer 10f8c2d2-7115-4349-b124-e497f0b7f00f');
  //   expect(result.status).toEqual(200);
  // });

  // it('GET /history should return 204 if no shoppings in user history', async () => {
  //   const result = await supertest(app)
  //     .get('/history')
  //     .set('Authorization', 'Bearer token');
  //   expect(result.status).toEqual(204);
  // });

  // it('GET /history should return 200 if logged user and at least 1 shopping', async () => {
  //   const result = await supertest(app)
  //     .get('/history')
  //     .set('Authorization', 'Bearer token');
  //   expect(result.status).toEqual(200);
  // });

  it('GET /history should return 401 if not logged user', async () => {
    const result = await supertest(app)
      .get('/history')
      .set('Authorization', 'Bearer ');
    expect(result.status).toEqual(401);
  });

  it('GET /history should return 401 if invalid token', async () => {
    const result = await supertest(app)
      .get('/history')
      .set('Authorization', 'Bearer token');
    expect(result.status).toEqual(401);
  });

  it('POST /checkout should return 400 if invalid fields', async () => {
    const body = {
      installments: '0',
      deliveryFee: 'oi',
      paymentMethod: 'Dinheiro',
    };

    const result = await supertest(app)
      .post('/checkout')
      .send(body)
      .set('Authorization', 'Bearer token');
    expect(result.status).toEqual(400);
  });

  it('POST /checkout should return 401 if valid fields and invalid token', async () => {
    const body = {
      installments: 6,
      deliveryFee: 32,
      paymentMethod: 'PIX',
    };

    const result = await supertest(app)
      .post('/checkout')
      .send(body)
      .set('Authorization', 'Bearer token');
    expect(result.status).toEqual(401);
  });
});
