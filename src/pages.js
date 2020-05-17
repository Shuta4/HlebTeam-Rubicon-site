const express = require('express');
const router = express.Router();

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
		if (req.session.user == undefined) {
			res.redirect("/userpage/im");
			return;
		}
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
				global.pool.query("SELECT * FROM `works` WHERE `owner_id` = " + req.session.user.id, (err, rows, fields) => {
					if (err) {
						console.log("Error in getting work with owner id: " + req.session.user.id);
						console.log("Error: \n" + err + "\n");
						next(error);
						return;
					}
					res.render("./pages/user_page", {
						need_login: false,
						is_owner: true,
						user: req.session.user,
						works: rows
					})
				})
			} else {
				res.render("./pages/user_page", {
					need_login: true
				});	
			}
		}
		else {
			global.pool.query("SELECT * FROM `users` WHERE `id` = " + req.params.id, (err, rows, fields) => {
				if (err) {
					console.log("Error in getting user info with id: " + req.params.id);
					console.log("Error: \n" + err + "\n");
					next(error);
					return
				}
				if (rows[0] == undefined) {
					res.render("./pages/error404");
					return
				}
				var user = rows[0];
				global.pool.query("SELECT * FROM `works` WHERE `owner_id` = " + user.id, (err, rows, fields) => {
					if (err) {
						console.log("Error in getting work with owner id: " + user.id);
						console.log("Error: \n" + err + "\n");
						next(error);
						return;
					}
					var is_owner = false;
					if(req.session.user != undefined) is_owner = req.session.user.id == user.id
					res.render("./pages/user_page", {
						need_login: false,
						is_owner: false,
						user: user,
						works: rows
					})
				})
			})	
		}
	} catch (error) {
		next(error);
	}
});
router.get("/works/:id", (req, res, next) => {
	try {
		pool.query("SELECT * FROM `works` WHERE `id` = " + req.params.id, (err, rows, fields) => {
			if (err) {
				next(err);
				return
			}
			if (rows[0] == undefined) {
				res.status(404).render("./pages/error404");
				return
			}	
			work = rows[0];
			pool.query("SELECT * FROM `links` WHERE `owner_type` = 'work' AND `owner_id` = " + work.id, (err, rows, fields) => {
				if (err) {
					next(err);
					return
				}
				work.links = rows;
				pool.query("SELECT * FROM `images` WHERE `owner_type` = 'work' AND `owner_id` = " + work.id, (err, rows, fields) => {
					if (err) {
						next(err);
						return
					}
					work.images = rows;
					work.hr_created_at = work.created_at;
					res.render("./pages/work_page", {work: work});
				})
			});
		})
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
router.get("/about", (req, res, next) => {
	try {
		res.render("./pages/about");
	} catch (error) {
		next(error);
	}
});

module.exports = router;
