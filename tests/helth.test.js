/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';

describe('Server health', () => {
  it('should return status 200 if server is working', async () => {
    const result = await supertest(app)
      .get('/health');
    expect(result.status).toEqual(200);
  });
});
