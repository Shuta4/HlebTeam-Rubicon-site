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
			// Берем из бд пользователя сессии (если нету сессии, то отправляем пользователя логиниться)
			if(req.session.user) {
				res.render("./pages/user_page", {
					need_login: false,
					is_owner: true,
					user: req.session.user,
					works: []
				})
			} else {
				res.render("./pages/user_page", {
					need_login: true
				});	
			}
		}
		else {
			//Берем пользователя по id
			
			connection = sql.connection();
			sql.connect(connection);
			connection.query("SELECT * FROM `users` WHERE `id` = " + req.params.id + "", function(err, rows, fields) {
				if (err) {
					console.log("Error has occured during getting user: " + req.params.id);
					console.log("Error: \n" + err + "\n");
					return
				}
				if (rows[0] != undefined) {
					if (rows[0].id != undefined || rows[0].id != null) {
						var user = rows[0];
						if (req.session.user == undefined) var is_owner = false;
						else var is_owner = req.session.user.id == user.id;
						connection2 = sql.connection();
						sql.connect(connection2);
						connection2.query("SELECT * FROM `works` WHERE `owner_id` = " + user.id + "", (err, rows, fields) => {
							if (err) {
								console.log("Error in getting works by user id: " + user.id);
								console.log("Error: \n" + err + "\n");
								return;
							}
							res.render("./pages/user_page", {
								need_login: false,
								user: user,
								works: rows,
								is_owner: is_owner
							});							
						});
						sql.end(connection2);
					}
					else res.render("./pages/error404");
				} 
			});
			sql.end(connection);
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
