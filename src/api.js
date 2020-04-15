/* Файл, где будут все обращения к базе данных и т.п. */
const express = require('express');
const router = express.Router();
const register = require("./db/actions/register.js");
const Joi = require("joi");
const getUserInfo = require("./db/actions/getUserInfo.js");
const login = require("./db/actions/login.js");
const sql = require("./db/connection.js");


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
// Registration of a new user
router.post("/user/register", async (req, res, next) => {
	try {
		const result = Joi.validate(req.body, registerValidation)
		if (result.error) {
			console.log(result.error)
			res.json({
				"ok": false,
				error: result.error
			})
			return
		}
		var user = {
			username: result.value.username,
			email: result.value.email,
			password: result.value.password
		}
		connection = sql.connection();
		sql.connect(connection);
		connection.query('SELECT * FROM users WHERE users.email = "' + user.email + '" OR users.username = "' + user.username + '"', function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during checking of user " + user.username + " - " + user.email);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": err
				});
				return
			}
			try {
				if (rows[0] == undefined) {
					// Хеширование пароля
					const hash = user.password;

					user.password = hash
					// Если все ок, то регистрируем пользователя в бд
					register(user.username, user.email, user.password);
					res.json({
						"ok": true
					})
					next();
				} else {
					console.log("Tried to create existing user in registration with username: " + user.username);
					res.json({
						"ok": false,
						"error": "There are somebody with this username: " + user.username + "or email: " + user.email
					});
					return
				}
			} catch (err) {
				res.json({
					"ok": false,
					"error": err
				});
				return
			}
		});
		sql.end(connection);
	} catch (error) {
		res.json({
			"ok": false,
			"error": error
		});
		console.log(error)
		next(error)
	}
});
// Login
router.post("/user/login", async (req, res, next) => {
	try {
		var user = req.body;
		connection = sql.connection();
		sql.connect(connection);
		connection.query('SELECT * FROM users WHERE users.email = "' + user.email + '" OR users.username = "' + user.username + '"', function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during checking of user " + user.username + " - " + user.email);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": err
				});
				return
			}
			try {
				if (rows[0] == undefined) {
					// Хеширование пароля
					const hash = user.password;

					user.password = hash
					// Если все ок, то регистрируем пользователя в бд
					register(user.username, user.email, user.password);
					res.json({
						"ok": true
					})
					next();
				} else {
					console.log("Tried to create existing user in registration with username: " + user.username);
					res.json({
						"ok": false,
						"error": "There are somebody with this username: " + user.username + "or email: " + user.email
					});
					return
				}
			} catch (err) {
				res.json({
					"ok": false,
					"error": err
				});
				return
			}
		});
		sql.end(connection);
	} catch (error) {
		res.json({
			"ok": false,
			"error": error
		});
		console.log(error)
		next(error)
	}
	try {
		var user = req.body;
		// Проверка пользователя на существование, если пользователь не существует - отмена!
		const PromiseUserInfo = await getUserInfo(user.username, user.username);
		const userInfo = await PromiseUserInfo.resolve;
		if (!userInfo.ok) {
			console.log(userInfo);
			console.log("Error with getting user info.\nError: " + userInfo.error);
			res.json({
				"ok": false,
				"error": userInfo.error,
				"username": user.username
			})
			return
		}
		if (!userInfo.exist) {
			console.log("Tried to login not existing user in login with username: " + user.username);
			res.json({
				"ok": false, 
				"error": "There are no users with this username: " + user.username,
				"username": user.username
			});
			return
		}
		// Хеширование пароля
		const hash = user.password;

		user.password = hash
		// Если все ок, то регистрируем пользователя в бд
		const logged_user = login(user.username, user.password);
		if (logged_user == false) {
			console.log("User login failed!");
			res.json({"ok": false});
			next();
		} else {
			req.session.user = logged_user.result;
			res.json({"ok": true})
			next();
		}
	} catch (error) {
		res.json({"ok": false, "error": error});
		console.log(error)
		next(error)
	}
	next();
});
router.get("/user/search/:name", (req, res, next)=> {
	res.send("Поиск пользователей по имени (дает краткую инфу (user-preview))");
	next();
});
router.get("/user/get/:id", (req, res, next)=> {
	res.send("Получение информации о 1 пользователе по id. Дает полную информацию (user-page)");
	next();
});
router.put("/user/update/:id", (req, res, next)=> {
	res.send("Изменение информации о пользователе (в req.body дается объект с информацией которую нужно изменить!)");
	next();
});
router.delete("/user/delete/:id", (req, res, next)=> {
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
