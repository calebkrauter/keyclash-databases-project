const express = require('express');
const router = express.Router();
const keyClashQs = require('../services/keyClashQs');

/* GET queries. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await keyClashQs.getLeaderboard());
  } catch (err) {
    console.error(`Error while getting leaderboard `, err.message);
    next(err);
  }
});

module.exports = router;