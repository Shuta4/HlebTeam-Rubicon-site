/* Файл, где будут все обращения к базе данных и т.п. */
const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("API of HlebTeam site!")
  next();
});

/*
	Получение пользователя по id,
	Поиск пользователей по имени,
	Загрузка и выгрузка пользовательских фотографий,
	Создание, удаление, редактирование, удаление пользователей и работ.
*/

module.exports = router;