/* Файл, где будут все обращения к базе данных и т.п. */
const express = require('express');
const router = express.Router();
const register = require("./db/actions/register.js");
const Joi = require("joi");
const getUserInfo = require("./db/actions/getUserInfo.js");
const login = require("./db/actions/login.js")


router.get("/", (req, res, next) => {
  res.send("API of HlebTeam site!")
  next();
});

const registerValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
  password_confirmation: Joi.any().valid(Joi.ref('password')).required()
});
// Registration of a new user!
router.post("/user", async (req, res, next) => {
	try {
		const result = Joi.validate(req.body, registerValidation)
		if (result.error) {
			// Отправка ошибки
			console.log(result.error)
			res.json({"ok": false, error: result.error})
			return
		}
		// Проверка пользователя на существование, если пользователь уже существует - отмена!
		userInfo = getUserInfo();
		if (!userInfo.ok) {
			console.log("Error with getting user info.\n Error: " + userInfo.error);
			res.json({
				"ok": false,
				"error": userInfo.error,
				"email": result.value.email,
				"username": result.value.username
			})
			return
		}
		if (userInfo.exist) {
			console.log("Tried to create existing user in registration with username: " + result.value.username);
			res.json({
				"ok": false, 
				"error": "There are somebody with this username: " + result.value.username + "or email: " + result.value.email,
				"email": result.value.email,
				"username": result.value.username
			});
			return
		}
		// Хеширование пароля
		const hash = result.value.password;

		delete result.value.confirmationPassword
		result.value.password = hash
		// Если все ок, то регистрируем пользователя в бд
		register(result.value.username, result.value.email, result.value.password);
		res.json({"ok": true})
		next();
	} catch (error) {
		res.json({"ok": false, error: error});
		console.log(error)
		next(error)
	}
});
// Login
router.get("/user/login"), async (req, res, next) => {
	try {
		user = req.body;
		// Проверка пользователя на существование, если пользователь не существует - отмена!
		userInfo = getUserInfo();
		if (!userInfo.ok) {
			console.log("Error with getting user info.\n Error: " + userInfo.error);
			res.json({
				"ok": false,
				"error": userInfo.error,
				"email": user.email,
				"username": user.username
			})
			return
		}
		if (!userInfo.exist) {
			console.log("Tried to login not existing user in login with username: " + user.username);
			res.json({
				"ok": false, 
				"error": "There are no users with this username: " + user.username + "or email: " + user.email,
				"email": user.email,
				"username": user.username
			});
			return
		}
		// Хеширование пароля
		const hash = user.password;

		user.password = hash
		// Если все ок, то регистрируем пользователя в бд
		login(user.username, user.email, user.password);
		req.session.user = 
		res.json({"ok": true})
		next();
	} catch (error) {
		res.json({"ok": false, error: error});
		console.log(error)
		next(error)
	}
	next();
}
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
