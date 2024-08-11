const pool = require('../config/db');

async function getLeaderboard() {
  const sql = `
    SELECT us.username, hsr.ranking
    FROM userscore us
    JOIN highscoreranking hsr ON us.highscore 
    BETWEEN hsr.highscore_range_start AND hsr.highscore_range_end
    ORDER BY us.highscore DESC
  `;

  try {
    const [rows] = await pool.query(sql);
    return { data: rows };
  } catch (err) {
    throw err;
  }
}

async function getDailyLB() {
  const sql = `
    SELECT us.username, dl.top_daily_attempt, us.highscore
    FROM userscore us
    JOIN dailyleaderboard dl ON us.username = dl.username
    ORDER BY us.highscore DESC, dl.top_daily_attempt DESC
  `;

  try {
    const [rows] = await pool.query(sql);
    return { data: rows };
  } catch (err) {
    throw err;
  }
}

async function insertUser(username, email, password_hash) {
  const sql = `
    INSERT INTO userinfo (username, email, password_hash) 
    VALUES (?, ?, ?)
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

async function insertAttempt(username, characters_attempted, characters_missed, wpm) {
  const sql = `
    INSERT INTO UserAttempts (username, characters_attempted, characters_missed, wpm) 
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.query(sql, [username, characters_attempted, characters_missed, wpm]);
    return { id: result.insertId, username, wpm };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getLeaderboard,
  getDailyLB,
  insertUser,
  insertAttempt
};
