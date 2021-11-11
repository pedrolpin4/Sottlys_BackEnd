import bcrypt from 'bcrypt';
import connection from '../../src/database/database.js';

export default async function createUser() {
  const user = {
    name: 'Test User',
    email: 'test@email.com',
    password: '123456',
    hashedPassword: bcrypt.hashSync('123456', 10),
    token: '10f8c2d2-7115-4349-b124-e497f0b7f00f',
  };

  await connection.query(`INSERT INTO address (district, city, neighborhood, street, number) 
    VALUES ('RJ', 'new iguaçu', 'little factory', 'street michal fields', 87)`);

  const address = await connection.query('SELECT * FROM address');

  await connection.query(`INSERT INTO users (name, email, password, address_id, phone, cpf) 
    VALUES ('pedrin', 'oi@bol.com', '${user.hashedPassword}', '${address.rows[0].id}', '21967431453', '18615158712')`);

  const users = await connection.query('SELECT * FROM users');
  const idUser = users.rows[0].id;

  await connection.query(`INSERT INTO sessions (user_id, token) VALUES  (${idUser}, '${user.token}')`);

  return ({
    ...user,
    id: idUser,
  });
}
