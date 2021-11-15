/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';

describe('POST /checkout', () => {
  it('should return 400 if invalid fields', async () => {
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

  it('should return 401 if valid fields and invalid token', async () => {
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

  //   it('should return 200 if valid fields and valid token', async () => {
  //     const body = {
  //       installments: 6,
  //       deliveryFee: 32,
  //       paymentMethod: 'PIX',
  //     };
  //     const result = await supertest(app)
  //       .post('/checkout')
  //       .send(body)
  //       .set('Authorization', 'Bearer 10f8c2d2-7115-4349-b124-e497f0b7f00f');
  //     expect(result.status).toEqual(200);
  //   });
});
