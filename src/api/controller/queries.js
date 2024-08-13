const pool = require('../config/db');

// Function to display all users with ranks.
async function getLeaderboard() {
  const sql = `
    SELECT us.username, hsr.ranking
    FROM userscore us
    JOIN highscoreranking hsr ON us.highscore 
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
      SELECT email, password_hash FROM userinfo WHERE email = ? AND password_hash = ?`
    const [result] = await pool.query(sql, [email, password_hash]);
    console.log(result);

  } catch (err) {
    throw err + " User data does not match.";
  }
}

async function getDailyLB() {
  const sql = `
    SELECT us.username, dl.top_daily_attempt, us.highscore
    FROM userscore us
    JOIN dailyleaderboard dl ON us.username = dl.username
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
    FROM userattempts
    WHERE username = ?
    ORDER BY attempt_number DESC;
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
    SELECT username, current_avg, total_attempts, highscore
    FROM userscore
    WHERE username = ?;
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
// Claude 3.5 Sonnet used to get format for database access
// and error handeling.
async function insertUser(username, email, password_hash) {
  const sql = `
    INSERT INTO userinfo (username, email, password_hash) 
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

// TODO do this upon registration and alter upon achievement unlock.
async function insertAchievement(username) {
  const sql = `
    INSERT INTO achievements (paste_to_win, 
    play_ten_rounds, high_score_of_day, 
    first_score_of_day, early_bird, 
    high_wpm, slow_poke, easter_egg, 
    perfect_run, perfectionist, username) 
    VALUES (? ? ? ? ? ? ? ? ? ?) WHERE username = ?;
  `
  const [result] = await pool.query(sql, [paste_to_win,
    play_ten_rounds, high_score_of_day,
    first_score_of_day, early_bird,
    high_wpm, slow_poke, easter_egg,
    perfect_run, perfectionist, username]);

  // TODO add an alterAchievements function to
  // update the achievements of a current player based on the true/false values
  // in the their record.
  // TODO Find a way to store the current user token.

}

// Function to add an attempt by the user to the DB.
async function insertAttempt(username, characters_attempted, characters_missed, wpm) {
  const sql = `
    INSERT INTO UserAttempts (username, characters_attempted, characters_missed, wpm) 
    VALUES (?, ?, ?, ?);
  `;

  try {
    const [result] = await pool.query(sql, [username, characters_attempted, characters_missed, wpm]);
    return { id: result.insertId, username, wpm };
  } catch (err) {
    throw err;
  }
}

// Function to delete a user's account from the DB. Will cascade.
async function deleteUser(username) {
  const sql = `
    DELETE FROM userinfo
    WHERE id = ?;
  `;

  try {
    console.log('Attempting to delete user with ID:', username);
    const [rows] = await pool.query(sql, [username]);
    console.log('User deletion result:', rows);

    if (rows.affectedRows === 0) {
      console.log('No user found with ID:', username);
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
