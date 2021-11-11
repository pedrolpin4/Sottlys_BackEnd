import connection from '../../src/database/database.js';

export default async function createProduct() {
  const product = {
    name: 'vestido azul',
    description: 'vetido envelope longo',
    price: 300.00,
    installments: 6,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1fNP6KI6YPvNOBEVucrQqP4ZVIuJejnwEcA&usqp=CAU',
  };

  await connection.query('INSERT INTO products (name, description, price, installments) VALUES  ($1, $2, $3, $4)', [product.name, product.description, product.price, product.installments]);

  const products = await connection.query('SELECT * FROM products');
  const idProduct = products.rows[0].id;

  await connection.query('INSERT INTO images (name) VALUES ($1)', [product.image]);

  const images = await connection.query('SELECT * FROM images');
  const idImage = images.rows[0].id;

  await connection.query('INSERT INTO products_images (product_id, image_id) VALUES ($1, $2)', [idProduct, idImage]);

  await connection.query("INSERT INTO colors (name) VALUES ('azul')");
  const colors = await connection.query('SELECT * FROM colors');
  const idColor = colors.rows[0].id;

  await connection.query("INSERT INTO sizes (name) VALUES ('P')");
  const sizes = await connection.query('SELECT * FROM sizes');
  const idSize = sizes.rows[0].id;

  return ({
    ...product,
    idProduct,
    idColor,
    idImage,
    idSize,
  });
}
