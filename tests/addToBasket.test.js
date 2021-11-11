/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';

describe('POST /basket', () => {
  beforeAll(async () => {

  })

  it('Should returns 401 when receive an invalid token ', async () => {
        const result = await supertest(app)
          .post('/basket');
          expect(result.status).toEqual(401);
  });

  it('Should returns 400 if receive an non-existent id', async () => {
        const result = await supertest(app)
          .post('/basket');
        expect(result.status).toEqual(400);
  });
      
  it('Should returns 201 when item insert into basket', async () => {
        const result = await supertest(app)
          .post('/basket');
        expect(result.status).toEqual(201)
  });
}