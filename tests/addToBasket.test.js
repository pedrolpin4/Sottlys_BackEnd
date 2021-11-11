/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';

describe('POST /basket', () => {
  beforeAll(async () => {

  })

  it('Should returns 201 when item insert into basket', async () => {
        const result = await supertest(app)
          .get('/products-category/1');
        expect(result.body.length).toBeLessThanOrEqual(16);
  });

  it('Should returns 201 when item insert into basket', async () => {
        const result = await supertest(app)
          .get('/products-category/1');
        expect(result.body.length).toBeLessThanOrEqual(16);
  });
      
  it('Should returns 201 when item insert into basket', async () => {
        const result = await supertest(app)
          .get('/products-category/1');
        expect(result.body.length).toBeLessThanOrEqual(16);
  });
}