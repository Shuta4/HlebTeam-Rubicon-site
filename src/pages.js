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
		if(req.session.user) {
			res.render("./pages/user_page", {
				need_login: false,
				is_owner: true,
				user: req.session.user
			})
		} else {
			res.render("./pages/user_page", {
				need_login: true
			});	
		}
	}
	else {
		//Берем пользователя по id
		var user = {

		}
		var is_owner = req.session.user.id == user.id
		res.render("./pages/user_page", {
			need_login: false,
			user: user,
			is_owner: is_owner
		});	
	}
  	next();
});
router.get("/userpage/im/edit", (req, res, next) => {
	res.render("./pages/edit_user");
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
router.get("/tcw", (req, res, next) => {
	res.render("./pages/temp_new_work");
	next();
});

module.exports = router;
