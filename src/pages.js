const express = require('express');
const router = express.Router();
const sql = require("./db/connection.js")

router.get("/", (req, res, next) => {
  res.render("./pages/index");
  next();
});
router.get("/userpage", (req, res, next) => {
	res.render("./pages/find_user");
	next();
});
router.get("/userpage/:id", (req, res, next) => {
	if (req.params.id == "im") {
		// Берем из бд пользователя сессии (если нету сессии, то )
		if(req.params.user) {
			res.render("./pages/user_page", {
				need_login: false,
				username: "Вася пупкин"
			})
		} else {
			res.render("./pages/user_page", {
				need_login: true,
				username: "Вася пупкин"
			});	
		}
	}
	else {
		//Берем пользователя по id

		res.render("./pages/user_page", {
			need_login: false,
			username: "Вася пупкин"
		});
	}
  	next();
});
router.get("/donate", (req, res, next) => {
  res.render("./pages/donate");
  next();
});
router.get("/twork", (req, res, next) => {
	res.render("./pages/work_page");
	next();
});
router.get("/about", (req, res, next) => {
	res.render("./pages/about");
	next();
});

module.exports = router;
