/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';

describe('POST /shopping', () => {
  it('should return 201 if valid fields', async () => {
    const body = {};

    const result = await supertest(app)
      .post('/checkout')
      .send(body);
    expect(result.status).toEqual(200);
  });
});
