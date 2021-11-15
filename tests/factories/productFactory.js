import connection from '../../src/database/database.js';

const product = {
  name: 'vestido azul',
  description: 'vetido envelope longo',
  price: 300.00,
  installments: 6,
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1fNP6KI6YPvNOBEVucrQqP4ZVIuJejnwEcA&usqp=CAU',
};

async function createProduct() {
  await connection.query('INSERT INTO products (name, description, price, installments) VALUES  ($1, $2, $3, $4);', [product.name, product.description, product.price, product.installments]);

  const products = await connection.query('SELECT * FROM products;');
  const idProduct = products.rows[0].id;

  await connection.query('INSERT INTO images (name) VALUES ($1);', [product.image]);

  const images = await connection.query('SELECT * FROM images;');
  const idImage = images.rows[0].id;

  await connection.query('INSERT INTO products_images (product_id, image_id) VALUES ($1, $2);', [idProduct, idImage]);

  await connection.query("INSERT INTO colors (name) VALUES ('azul');");
  const colors = await connection.query('SELECT * FROM colors;');
  const idColor = colors.rows[0].id;

  await connection.query("INSERT INTO sizes (name) VALUES ('G');");
  const sizes = await connection.query('SELECT * FROM sizes;');
  const idSize = sizes.rows[0].id;

  return ({
    ...product,
    idProduct,
    idColor,
    idImage,
    idSize,
  });
}

async function deleteProduct() {
  // await connection.query('DELETE FROM products_images WHERE product_id = $1;', [id_product]);
  await connection.query('DELETE FROM products_images;');
  await connection.query('DELETE FROM images WHERE name = $1;', [product.image]);
  await connection.query('DELETE FROM colors WHERE name = $1;', ['azul']);
  await connection.query('DELETE FROM sizes WHERE name = $1;', ['G']);
}

export {
  createProduct,
  deleteProduct,
};
