const express = require('express');
const router = express.Router();

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
		res.render("./pages/user_page");	
	}
	else {
		//Берем пользователя по id
		res.render("./pages/user_page");
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

module.exports = router;