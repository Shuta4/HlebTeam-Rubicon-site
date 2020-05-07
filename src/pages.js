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
