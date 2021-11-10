/* eslint-disable no-undef */
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app.js';
import connection from '../src/database/database.js';

describe('POST /sign-up', () => {
  beforeAll(async () => {
    const encriptedPassword = bcrypt.hashSync('1234567', 10);

    await connection.query(`INSERT INTO address (district, city, neighborhood, street, number) 
        VALUES ('RJ', 'new iguaçu', 'little factory', 'street michal fields', 87)`);

    const address = await connection.query('SELECT * FROM address');

    await connection.query(`INSERT INTO users (name, email, password, address_id, phone, cpf) 
        VALUES ('pedrin', 'oi@uol.com', '${encriptedPassword}', '${address.rows[0].id}', '21967431453', '18615158711')`);
  });

  it('should return 400 if missing fields', async () => {
    const body = {
      name: 'oi',
      email: 'oi@gmail.com',
      cpf: '18615158711',
    };

    const result = await supertest(app)
      .post('/sign-up')
      .send(body);
    expect(result.status).toEqual(400);
  });

  it('should return 400 if empty fields', async () => {
    const body = {
      name: 'oi',
      email: 'oi@gmail.com',
      password: '123456',
      address: {},
      phone: '',
      cpf: '18615158711',
    };

    const result = await supertest(app)
      .post('/sign-up')
      .send(body);
    expect(result.status).toEqual(400);
  });

  it('should return 400 and a message if invalid fields', async () => {
    const body = {
      name: 'oi',
      email: 'oi.com',
      password: '123',
      address: {
        district: 23,
        city: 'hf',
      },
      phone: '21312392131230213',
      cpf: 'asdwrtgfrqw',
    };

    const result = await supertest(app)
      .post('/sign-up')
      .send(body);
    expect(result.status).toEqual(400);
    expect(result.body).toEqual({
      message: expect.any(String),
    });
  });

  it('should return 409 and a message if email conflict', async () => {
    const body = {
      name: 'oii',
      email: 'oi@uol.com',
      password: '123456',
      cpf: '18715258812',
      address: {
        district: 'RS',
        city: 'new york',
        neighborhood: 'little industry',
        street: 'street michal fields',
        number: 87,
        complement: '',
      },
      phone: '21978542564',
    };

    const result = await supertest(app)
      .post('/sign-up')
      .send(body);
    expect(result.status).toEqual(409);
    expect(result.body).toEqual({
      message: 'Looks like this email is already on our database',
    });
  });

  it('should return 409 and a message if cpf conflict', async () => {
    const body = {
      name: 'oii',
      email: 'oi@gmail.com',
      password: '123456',
      cpf: '18615158711',
      address: {
        district: 'RS',
        city: 'new york',
        neighborhood: 'little industry',
        street: 'street michal fields',
        number: 87,
        complement: '',
      },
      phone: '21978542564',
    };

    const result = await supertest(app)
      .post('/sign-up')
      .send(body);
    expect(result.status).toEqual(409);
    expect(result.body).toEqual({
      message: 'Looks like this cpf is already on our database',
    });
  });

  it('should return 201 if valid fields', async () => {
    const body = {
      name: 'oii',
      email: 'oi@gmail.com',
      password: '123456',
      cpf: '18715258812',
      address: {
        district: 'RS',
        city: 'new york',
        neighborhood: 'little industry',
        street: 'street michal fields',
        number: 87,
        complement: '',
      },
      phone: '21978542564',
    };

    const result = await supertest(app)
      .post('/sign-up')
      .send(body);
    expect(result.status).toEqual(201);
  });
});

describe('POST "/sign-in" ', () => {
  afterAll(async () => {
    await connection.query('DELETE FROM sessions');
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM address');
    connection.end();
  });

  it('POST "/sign-in" returns 400 if non complete objects', async () => {
    const body = {
      password: '',
    };

    const result = await supertest(app)
      .post('/sign-in')
      .send(body);
    expect(result.status).toEqual(400);
  });

  it('POST "/sign-in" return 400 if empty fields', async () => {
    const body = {
      email: '',
      password: '123456',
    };

    const result = await supertest(app)
      .post('/sign-in')
      .send(body);
    expect(result.status).toEqual(400);
  });

  it('POST "/sign-in" returns 400 if invalid values', async () => {
    const body = {
      email: 'posi',
      password: '123',
    };

    const result = await supertest(app)
      .post('/sign-in')
      .send(body);
    expect(result.status).toEqual(400);
  });

  it('POST "/sign-in" returns 404 if the email is not in the database', async () => {
    const body = {
      email: 'oi@hotmail.com',
      password: '123456',
    };

    const result = await supertest(app)
      .post('/sign-in')
      .send(body);
    expect(result.status).toEqual(404);
  });

  it('POST "/sign-in" returns 401 if a wrong password', async () => {
    const body = {
      email: 'oi@uol.com',
      password: '12345678',
    };

    const result = await supertest(app)
      .post('/sign-in')
      .send(body);
    expect(result.status).toEqual(401);
  });

  it('POST "/sign-in" returns 200 if success', async () => {
    const body = {
      email: 'oi@uol.com',
      password: '1234567',
    };

    const result = await supertest(app)
      .post('/sign-in')
      .send(body);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      token: expect.any(String),
      user: expect.any(Object),
    });
  });
});
