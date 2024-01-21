/** Database config for database. */


const { Client } = require("pg");
const { DB_URI } = require("./config");
const password = require("./password")

if (process.env.NODE_ENV === "test") {
  database = "books-test";
} else {
  database = "books";
};

const db = new Client({
  user: 'dianaloz',
  host: '/var/run/postgresql',
  password: password,
  database: database,
  port: 5432
});


db.connect()
  .then(() => {
    console.log('Connected to the database');
    // Perform database operations here
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
    // Additional error details for debugging
    console.error('Error code:', err.code); // PostgreSQL error code
    console.error('Error message:', err.message); // Description of the error
    console.error('Error stack:', err.stack); // Stack trace
  });

module.exports = db;

