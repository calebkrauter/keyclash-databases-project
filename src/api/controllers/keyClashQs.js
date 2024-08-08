const db = require('./db');
const helper = require('../helper');
const config = require('../config');

// get lifetime leaderboard.
async function getLeaderboard() {
    const rows = await db.query(
        `SELECT us.username, hsr.ranking
        FROM userscore us
        JOIN highscoreranking hsr ON us.highscore 
        BETWEEN hsr.highscore_range_start AND hsr.highscore_range_end
        ORDER BY us.highscore DESC;`
    );
    const data = helper.emptyOrRows(rows);

    return {
        data
    }
}

// Get leaderboard from today's attempts.
async function getDailyLB() {
    const rows = await db.query(
        `SELECT us.username, dl.top_daily_attempt, us.highscore
        FROM userscore us
        JOIN dailyleaderboard dl ON us.username = dl.username
        ORDER BY us.highscore DESC, ua.accuracy_percentage DESC;`
    );
    const data = helper.emptyOrRows(rows);

    return {
        data
    }
}

// add a new user to the database.
async function insertUser(username, email, password_hash) {
    const rows = await db.query(
        `INSERT INTO userinfo (username, name,         password_hash) VALUES
         (${username}, ${email}, ${password_hash})`
    );
}

// user must already exist in database.
async function insertAttempt({username}, characters_attempted, characters_missed, wpm) {
    const rows = await db.query(
        `INSERT INTO UserAttempts (username, characters_attempted,
         characters_missed, wpm) VALUES
         (${username}, ${characters_attempted}, ${characters_missed}, ${wpm});`
    );
}

module.exports = {
    getLeaderboard,
    getDailyLB,
    insertUser,
    insertAttempt
}