const pgPromise = require('pg-promise');
const { DB_URI } = require('./config');

// Load and initialize pg-promise:
const pgp = pgPromise({});

// Create the database instance:
const db = pgp(DB_URI);

module.exports.getCustomerById = async (id) => {
  const customer = await db.oneOrNone(`SELECT * FROM customer WHERE id = $1`, +id);
  return customer;
};