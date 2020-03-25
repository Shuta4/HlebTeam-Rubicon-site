/* Файл, где будут все обращения к базе данных и т.п. */
const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("API of HlebTeam site!")
  next();
});

module.exports = router;