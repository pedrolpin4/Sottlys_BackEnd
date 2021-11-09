import connection from '../database/database.js';
import signUpValidation from '../validations/joiValidations.js';

async function postSignUp(req, res) {
  const { body } = req;
  const validation = signUpValidation.validate(body);
  if (validation.error) {
    res.status(400).send({
      message: validation.error.message,
    });
    return;
  }

  const users = await connection.query('SELECT * FROM users');
  const isValidEmail = users.rows.some((user) => user.email === body.email);
  const isValidCpf = users.rows.some((user) => user.cpf === body.cpf);

  if (isValidEmail) {
    res.status(409).send({
      message: 'Looks like this email is already on our database',
    });
    return;
  }

  if (isValidCpf) {
    res.status(409).send({
      message: 'Looks like this cpf is already on our database',
    });
    return;
  }

  res.sendStatus(201);
}

export default postSignUp;
