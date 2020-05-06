const express = require('express');
const router = express.Router();
const sql = require("./db/connection.js")

router.get("/", (req, res, next) => {
	try {
		res.render("./pages/index");
	} catch (error) {
		next(error);
	}
}); 
router.get("/userpage", (req, res, next) => {
	try {
		res.render("./pages/find_user");
	} catch (error) {
		next(error);
	}
});
router.get("/userpage/creatework", (req, res, next) => {
	try {
		res.render("./pages/update_work", {create_new: true});
	} catch (error) {
		next(error);
	}
});

router.get("/userpage/im/edit", (req, res, next) => {
	try {
		res.render("./pages/edit_user");
	} catch (error) {
		next(error);
	}
});
router.get("/userpage/:id", (req, res, next) => {
	try {
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
	} catch (error) {
		next(error);
	}
});
router.get("/donate", (req, res, next) => {
	try {
		res.render("./pages/donate");
	} catch (error) {
		next(error);
	}
});
router.get("/twork", (req, res, next) => {
	try {
		res.render("./pages/work_page");
	} catch (error) {
		next(error);
	}
});
router.get("/about", (req, res, next) => {
	try {
		res.render("./pages/about");
	} catch (error) {
		next(error);
	}
});

module.exports = router;
