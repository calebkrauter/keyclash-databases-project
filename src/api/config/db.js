const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// Create a pool using the database configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT, 10),
});

module.exports = pool;

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
