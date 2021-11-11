import bcrypt from 'bcrypt';
import connection from '../../src/database/database.js';

const user = {
  name: 'Test User',
  email: 'test@email.com',
  password: '123456',
  hashedPassword: bcrypt.hashSync('123456', 10),
  token: '10f8c2d2-7115-4349-b124-e497f0b7f01f',
};

async function createUser() {
  await connection.query(`INSERT INTO address (district, city, neighborhood, street, number) 
    VALUES ('RJ', 'new iguaçu', 'little factory', 'street michal fields', 27)`);

  const address = await connection.query('SELECT * FROM address');

  await connection.query(`INSERT INTO users (name, email, password, address_id, phone, cpf) 
    VALUES ('${user.name}', '${user.email}', '${user.hashedPassword}', '${address.rows[0].id}', '21967431453', '22880825857')`);

  const users = await connection.query('SELECT * FROM users');
  const idUser = users.rows[0].id;

  await connection.query(`INSERT INTO sessions (user_id, token) VALUES  (${idUser}, '${user.token}')`);

  return ({
    ...user,
    id: idUser,
  });
}

async function deleteUser() {
  await connection.query('DELETE FROM sessions WHERE token = $1;', [user.token]);
  await connection.query('DELETE FROM users WHERE name = $1;', [user.name]);
  await connection.query('DELETE FROM address WHERE number = $1;', ['27']);
}

export {
  createUser,
  deleteUser,
};
