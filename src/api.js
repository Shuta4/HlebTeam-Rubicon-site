/* Файл, где будут все обращения к базе данных и т.п. */
const express = require('express');
const router = express.Router();
const register = require("./db/actions/register.js");
const Joi = require("joi");

router.get("/", (req, res, next) => {
  res.send("API of HlebTeam site!")
  next();
});

const registerValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
  password_confirmation: Joi.any().valid(Joi.ref('password')).required()
})

// Registration of a new user!
router.post("/user/", async (req, res, next) => {
	try {
		const result = Joi.validate(req.body, registerValidation)
		if (result.error) {
			// Отправка ошибки
			res.send({ok: false})
			return
		}
		// Проверка пользователя на существование, если пользователь уже существует - отмена!

		// Хеширование пароля
		const hash = await User.hashPassword(result.value.password)

		delete result.value.confirmationPassword
		result.value.password = hash
		// Если все ок, то регистрируем пользователя в бд
		register(result.value.username, result.value.email, result.value.password);
		res.send({ok: true})
		next();
	} catch (error) {
		res.send({ok: false})
		next(error)
	}
	next();
});
router.get("/user/find/:name", (req, res, next)=> {
	res.send("Поиск пользователей по имени (дает краткую инфу (user-preview))");
	next();
});
router.get("/user/:id", (req, res, next)=> {
	res.send("Получение информации о 1 пользователе по id. Дает полную информацию (user-page)");
	next();
});
router.put("/user/:id", (req, res, next)=> {
	res.send("Изменение информации о пользователе (в req.body дается объект с информацией которую нужно изменить!)");
	next();
});
router.delete("/user/:id", (req, res, next)=> {
	res.send("Удаление пользователя (только по id)");
	next();
});

router.post("/work/", (req, res, next)=> {
	res.send("Создание работы");
	next();
});
//Возможно нужны альтернативные способы поиска работ
router.get("/work/:id", (req, res, next)=> {
	res.send("Получение информации о 1 работе по id. Дает полную информацию (work-page)");
	next();
});
router.put("/work/:id", (req, res, next)=> {
	res.send("Изменение информации о работе (в req.body дается объект с информацией которую нужно изменить!)");
	next();
});
router.delete("/work/:id", (req, res, next)=> {
	res.send("Удаление работы (только по id)");
	next();
});

router.post("/img/", (req, res, next)=> {
	res.send("Загрузка фотографии на сервер");
	next();
});
router.get("/img/:id", (req, res, next)=> {
	res.send("Получение картинки"); // Возможно нужно больше способов получения
	next();
});

module.exports = router;
