const pool = require('../config/db');

// Function to display all users with ranks.
async function getLeaderboard() {
  const sql = `
    SELECT us.username, hsr.ranking
    FROM user_score us
    JOIN highscore_ranking hsr ON us.highscore 
    BETWEEN hsr.highscore_range_start AND hsr.highscore_range_end
    ORDER BY us.highscore DESC;
  `;

  try {
    const [rows] = await pool.query(sql);
    return { data: rows };
  } catch (err) {
    throw err;
  }
}

// Function for login to find matching user in db.
async function getUser(email, password_hash) {
  try {
    const sql = `
      SELECT email, password_hash FROM user_info WHERE email = ? AND password_hash = ?`;
    const [result] = await pool.query(sql, [email, password_hash]);
    console.log(result);
    return result;
  } catch (err) {
    throw err + " User data does not match.";
  }
}

async function getDailyLB() {
  const sql = `
    SELECT ui.username, dl.top_daily_attempt, us.highscore
    FROM user_score us
    JOIN daily_leaderboard dl ON us.user_id = dl.user_id
    JOIN user_info ui ON us.user_id = ui.user_id
    ORDER BY us.highscore DESC, dl.top_daily_attempt DESC;
  `;

  try {
    const [rows] = await pool.query(sql);
    return { data: rows };
  } catch (err) {
    throw err;
  }
}

// Function used to retrieve last 5 attempt stats for user.
async function getAttempts(username) {
  const sql = `
    SELECT attempt_date, attempt_number, characters_attempted,
    characters_missed, wpm, accuracy_percentage
    FROM user_attempts
    WHERE user_id = (SELECT user_id FROM user_info WHERE username = ?)
    ORDER BY attempt_number DESC
    LIMIT 5;
  `;

  try {
    console.log('Fetching attempts for user:', username);
    const [rows] = await pool.query(sql, [username]);
    console.log(`Retrieved ${rows.length} attempts for user:`, username);
    return rows;
  } catch (err) {
    console.error('Error in getAttempts:', err);
    console.error('Error stack:', err.stack);
    throw err;
  }
}

//Function used to retrieve lifetime stats of certain user.
async function getUserStats(username) {
  const sql = `
    SELECT ui.username, us.current_avg, us.total_attempts, us.highscore
    FROM user_score us
    JOIN user_info ui ON us.user_id = ui.user_id
    WHERE ui.username = ?;
  `;

  try {
    console.log('Fetching stats for user:', username);
    const [rows] = await pool.query(sql, [username]);

    if (rows.length === 0) {
      console.log('No stats found for user:', username);
      return null;
    }

    console.log('Retrieved stats for user:', username);
    return rows[0];
  } catch (err) {
    console.error('Error in getUserStats:', err);
    console.error('Error stack:', err.stack);
    throw err;
  }
}

// Function for registering new user and adding to DB.
async function insertUser(username, email, password_hash) {
  const sql = `
    INSERT INTO user_info (username, email, password_hash) 
    VALUES (?, ?, ?);
  `;

  try {
    console.log('Attempting to insert user:', { username, email });
    const [result] = await pool.query(sql, [username, email, password_hash]);
    console.log('User inserted successfully:', result);
    return { id: result.insertId, username, email };
  } catch (err) {
    console.error('Error in insertUser:', err);
    console.error('Error stack:', err.stack);
    throw err;
  }
}

// Function to add an attempt by the user to the DB.
async function insertAttempt(username, characters_attempted, characters_missed, wpm) {
  const sql = `
    INSERT INTO user_attempts (user_id, characters_attempted, characters_missed, wpm) 
    SELECT ui.user_id, ?, ?, ?
    FROM user_info ui
    WHERE ui.username = ?;
  `;

  try {
    const [result] = await pool.query(sql, [characters_attempted, characters_missed, wpm, username]);
    return { id: result.insertId, username, wpm };
  } catch (err) {
    throw err;
  }
}

// Function to delete a user's account from the DB. Will cascade.
async function deleteUser(username) {
  const sql = `
    DELETE FROM user_info
    WHERE username = ?;
  `;

  try {
    console.log('Attempting to delete user:', username);
    const [rows] = await pool.query(sql, [username]);
    console.log('User deletion result:', rows);

    if (rows.affectedRows === 0) {
      console.log('No user found with username:', username);
      return { success: false, message: 'User not found' };
    }

    console.log('User deleted successfully');
    return { success: true, message: 'User deleted successfully' };
  } catch (err) {
    console.error('Error in deleteUser:', err);
    console.error('Error stack:', err.stack);
    throw err;
  }
}

module.exports = {
  getUser,
  getLeaderboard,
  getDailyLB,
  getAttempts,
  getUserStats,
  insertUser,
  insertAttempt,
  deleteUser,
};