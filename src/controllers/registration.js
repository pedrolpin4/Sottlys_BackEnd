import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import connection from '../database/database.js';
import { signInValidation, signUpValidation } from '../validations/joiValidations.js';

async function postSignUp(req, res) {
  const {
    name,
    email,
    password,
    cpf,
    address,
    phone,
  } = req.body;

  const encriptedPassword = bcrypt.hashSync(`${password}`, 10);

  const validation = signUpValidation.validate(req.body);
  if (validation.error) {
    res.status(400).send({
      message: validation.error.message,
    });
    return;
  }

  const {
    district,
    city,
    neighborhood,
    street,
    number,
    complement,
  } = address;

  try {
    const users = await connection.query('SELECT * FROM users');
    const isValidEmail = users.rows.some((user) => user.email === req.body.email);
    const isValidCpf = users.rows.some((user) => user.cpf === req.body.cpf);
    if (isValidEmail) {
      res.status(409).send({
        message: 'Looks like this email is already on our database',
      });
      return;
    }
    if (isValidCpf) {
      res.status(401).send({
        message: 'Looks like this cpf is already on our database',
      });
      return;
    }

    await connection.query(`INSERT INTO address (district, city, neighborhood, street, number, complement) 
      VALUES ($1, $2, $3, $4, $5, $6)`, [district, city, neighborhood, street, number, complement]);

    const addressResult = await connection.query('SELECT * FROM address WHERE street = $1 AND number = $2', [street, number]);

    await connection.query(`INSERT INTO users (name, email, password, address_id, phone, cpf) 
        VALUES ($1, $2, '${encriptedPassword}', '${addressResult.rows[0].id}', $3, $4)`, [name, email, phone, cpf]);
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
}

const postSignIn = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  if (signInValidation.validate(req.body).error) {
    res.sendStatus(400);
    return;
  }

  try {
    const result = await connection.query(`SELECT * FROM users
          WHERE email = $1`, [email]);

    const user = result.rows[0];

    if (!user) {
      res.sendStatus(404);
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      res.sendStatus(401);
      return;
    }

    const token = uuid();
    await connection.query(`INSERT INTO sessions (user_id, token) 
          VALUES($1, $2)`, [user.id, token]);

    res.send({
      token,
      user,
    }).status(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

export {
  postSignUp,
  postSignIn,
};
