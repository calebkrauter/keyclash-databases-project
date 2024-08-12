const pool = require('./db');

async function testConnection() {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Execute a simple query to test the connection
    await connection.query('SELECT 1');
    console.log('Database connection successful!');

    // Release the connection back to the pool
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Run the test connection function
testConnection();
