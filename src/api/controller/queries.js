const pool = require('../config/db');
const bcrypt = require('bcrypt')
// Function to display all users with ranks.
async function getLeaderboard() {
  const sql = `
    SELECT ui.username, us.highscore, hsr.ranking
    FROM user_score us
    JOIN user_info ui ON us.user_id = ui.user_id
    JOIN highscore_ranking hsr ON us.highscore 
    BETWEEN hsr.highscore_range_start AND hsr.highscore_range_end
    ORDER BY us.highscore DESC, ui.username ASC;
  `;

  try {
    const [rows] = await pool.query(sql);
    return { data: rows };
  } catch (err) {
    throw err;
  }
}
async function getUser(email, password_hash) {
  try {
    const sql = `
        SELECT email, password_hash 
        FROM user_info 
        WHERE email = ? AND password_hash = ?
      `;
    const [result] = await pool.query(sql, [email, password_hash]);
    console.log(result);
    return result;
  } catch (err) {
    throw err + " User data does not match.";
  }
}

// Function for login to find matching user in db.
async function insertUser(username, email, password) {
  const sql = `
    INSERT INTO user_info (username, email, password_hash) 
    VALUES (?, ?, ?);
  `;

  try {
    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(sql, [username, email, password_hash]);
    return { id: result.insertId, username, email };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      if (err.sqlMessage.includes('email')) {
        return { error: 'Email already exists' };
      } else if (err.sqlMessage.includes('username')) {
        return { error: 'Username already exists' };
      }
    }
    return { error: 'Registration failed' };
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


async function getUserIdByEmail(email) {
  const sql = 'SELECT user_id FROM user_info WHERE email = ?';

  try {
    const [rows] = await pool.query(sql, [email]);

    if (rows.length === 0) {
      throw new Error('User not found');
    }

    return rows[0].user_id;
  } catch (err) {
    console.error('Error in getUserIdByEmail:', err);
    throw err;
  }
}

// Function to add an attempt by the user to the DB.
async function insertAttempt(user_id, characters_attempted, characters_missed, wpm) {
  const query = `
    INSERT INTO user_attempts (user_id, characters_attempted, characters_missed, wpm) 
    VALUES (?, ?, ?, ?);  
  `;

  try {
    // const user_id = getUserIdByEmail(email);

    const [result] = await pool.query(insertAttemptSQL, [user_id, characters_attempted, characters_missed, wpm]);

    const [attemptDetails] = await pool.query(
      `
        SELECT attempt_number
        FROM user_attempts
        WHERE user_id = ?
        ORDER BY attempt_number DESC
        LIMIT 1
      `,
      [user_id]
    );

    return {
      id: result.insertId,
      attempt_number: attemptDetails[0].attempt_number,
      wpm,
      characters_attempted,
      characters_missed,
    };
  } catch (err) {
    console.error('Error in insertAttempt:', err);
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
  getUserIdByEmail,
};