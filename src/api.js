/* Файл, где будут все обращения к базе данных и т.п. */
const express = require('express');
const router = express.Router();
const Joi = require("joi");
const fs = require("fs");
const multer  = require('multer')
upload = multer({ dest: './uploads/' });

router.get("/", (req, res, next) => {
  res.send("API of HlebTeam site!")
  next();
});

/*
	Errors codes:
		ERRVALIDATEUSER - Error with validating user,
		ERRNOTLOGGEDIN - To proceed, user needs to login,
		ERRACCESSDENIED - No access,
		ERRDBCONNECTION - Error with db,
		USEREXIST - User is already exist,
		UNKNOWNERROR - Unknown error,
		USERNOTEXIST - User is not exist,
		ERRINCORRECTPASSWORD - password for user is incorrect
		IMGNOTEXIST - There is no image
*/	

const registerValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{6,100}$/).required(),
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
				"error": "ERRVALIDATEUSER"
			})
			return
		}
		var user = {
			username: result.value.username,
			email: result.value.email,
			password: result.value.password
		}
		global.pool.query('SELECT * FROM users WHERE users.email = "' + user.email + '" OR users.username = "' + user.username + '"', function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during checking of user " + user.username + " - " + user.email);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": "ERRDBCONNECTION"
				});
				return
			}
			try {
				if (rows[0] == undefined) {
					// Хеширование пароля
					const hash = user.password;

					user.password = hash
					// Если все ок, то регистрируем пользователя в бд
					global.pool.query("INSERT INTO `users`(`username`, `email`, `password`) VALUES ('" 
							+ user.username + "', '" 
							+ user.email + "', '" 
							+ user.password + "')", function(err) {
						if (err) {
								console.log("Error has occured during creation of user " + user.username);
								console.log("Error: \n" + err + "\n");
								res.json({
									"ok": false,
									"error": "ERRDBCONNECTION"
								});
							}
							console.log("Succesfully created user " + user.username);
							res.json({
								"ok": true
							});
							req.session.user = user;
						});
				} else {
					console.log("Tried to create existing user in registration with username: " + user.username);
					res.json({
						"ok": false,
						"error": "USEREXIST"
					});
					return
				}
			} catch (err) {
				console.log(err);
				res.json({
					"ok": false,
					"error": "UNKNOWNERROR"
				});
				return
			}
		});
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error);
	}
});
// Login
router.post("/user/login", async (req, res, next) => {
	try {
		var user = req.body;
		global.pool.query('SELECT * FROM users WHERE users.email = "' + user.username + '" OR users.username = "' + user.username + '"', function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during checking/logging of user " + user.username);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": "ERRDBCONNECTION"
				});
				return
			}
			if (rows[0] == undefined) {
				console.log("Tried to login non existing user in login with username: " + user.username);
				res.json({
					"ok": false,
					"error": "USERNOTEXIST"
				});
				return
			} else {
				// Хеширование пароля
				const hash = user.password;

				user.password = hash;
				if (rows[0].password == user.password) {
					req.session.user = rows[0];
					res.json({
						"ok": true
					});
				} else {
					console.log("Password for user " + user.username + " is incorrect!");
					res.json({
						"ok": false,
						"error": "ERRINCORRECTPASSWORD"
					});
				}
			}
		});
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)
	}
});
router.post("/user/logout", (req, res, next) => {
	try {
		req.session.destroy(function(err) {
			if (err) {
				console.log("error!");	
				res.json({
					"ok": false,
					"error": "ERRLOGOUTFAILED"
				});
			} 
			res.json({
				"ok": true
			});
			next();
  		});
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});
router.get("/user/search/:name", (req, res, next) => {
	try {
		const name = req.params.name;
		global.pool.query("SELECT * FROM `users` WHERE `username` LIKE '%" + name + "%' OR `name` LIKE '%" + name + "%' OR `surname` LIKE '%" + name + "%' OR `name` + ' ' + `surname` LIKE '%"+ name +"%'", function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during searching user: " + name);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": "ERRDBCONNECTION"
				});
				return
			}
			res.json({
				"ok": true,
				"result": JSON.stringify(rows)
			});
		});
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});
router.get("/user/get/:id", (req, res, next)=> {
	try {
		var id = req.params.id;
		if (id == "im") {
			if (req.session.user == undefined) {
				res.json({
					"ok": false,
					"error": "ERRNOTLOGGEDIN"
				})
				return
			}
			id = req.session.user.id;
		}
		global.pool.query("SELECT * FROM `users` WHERE `id` = " + id + "", function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during getting user by id: " + id);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": "ERRDBCONNECTION"
				});
				return
			}
			if (rows[0] != undefined) {
				if (rows[0].id != undefined || rows[0].id != null) res.json({
					"ok": true,
					"result": JSON.stringify(rows[0])
				});	
				else res.json({
					"ok": false,
					"error": "USERNOTEXIST"
				});
			}	
			else res.json({
				"ok": false,
				"error": "USERNOTEXIST"
			}); 
		});
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});
router.put("/user/update/:id", upload.single('avatar'), (req, res, next) => {
	try {
		if (req.session.user == undefined) {
			res.json({
				"ok": false,
				"error": "ERRNOTLOGGEDIN"
			});
			return
		}
		var user = req.body;
		var avatar = req.file;
		if (user.new_password != user.confirm_password && user.new_password != "") {
			res.json({
				"ok": false,
				"error": "ERRVALIDATEUSER"
			});
			return
		}
		if (user.new_password && user.old_password != req.session.user.password) {
			res.json({
				"ok": false,
				"error": "ERRINCORRECTPASSWORD"
			});
			return		
		}
		var password = user.new_password;
		if (req.params.id == "im") var id = req.session.user.id;
		else return;
		var password_req = password.trim() != "" ? "`password` = '" + password + "', " : "";
		var birthday_req = user.birthday.trim() != "" ? "`birthday` = '" + user.birthday + "' " : "`birthday` = NULL "; 
		var avatar_req = "";
		if (user.delete_avatar == "true") {
			if (req.session.user.avatar) {
				avatar_req = "`avatar` = 0, ";
				fs.unlink('src/public/img/uploads/avatars/' + id + ".jpg", function (err) {
					if (err) console.log(err);
				});
			}
		}  
		else {
			if (avatar) {
				if (avatar.mimetype == "image/jpeg" && avatar.size <= 5242880) {
					avatar_req = "`avatar` = 1, ";
					fs.rename(avatar.path, 'src/public/img/uploads/avatars/' + id + ".jpg", function (err) {
					    if (err) console.log(err);
					}); 
				} else {
					fs.unlink(avatar.path, (err) => {
						if (err) console.log(err);
					})
					res.json({
						"ok": false,
						"error": "INCORRECTIMAGE"
					})
					return;
				}
			} 
		}
		global.pool.query("UPDATE `users` SET " + 
			"`username` = '" + user.username + "', " +
			"`email` = '" + user.email + "', " + 
			password_req + 
			"`name` = '" + user.name + "', " + 
			"`surname` = '" + user.surname + "', " + 
			"`about` = '" + user.about + "', " + 
			avatar_req +
			birthday_req +
			"WHERE `id` = " + id + "", function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during updating user with id: " + id);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": "ERRDBCONNECTION"
				});
				return
			}
			res.json({
				"ok": true
			})
		});	
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});
router.delete("/user/delete/:id", (req, res, next)=> {
	try {
		res.send("Удаление пользователя (только по id)");
		next();		
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});

router.post("/work", upload.fields([{ name: 'preview', maxCount: 1 }, { name: 'images', maxCount: 100 }]), (req, res, next)=> {
	try {
		var work = req.body;
		if (req.session.user == undefined) {
			res.json({
				"ok": false,
				"error": "ERRNOTLOGGEDIN"
			});
			return;
		}
		if (work.owner_id != req.session.user.id) {
			res.json({
				"ok": false,
				"error": "ERRACCESSDENIED"
			});
			return;
		}
		var preview = req.files.preview[0];
		global.pool.query('INSERT INTO `works`(`owner_id`, `title`, `description`, `preview_img`, `download_link`) VALUES (' + work.owner_id + ',"' 
			+ work.title + '","' 
			+ work.description + '",' 
			+ preview ? 1 : 0 + ',"' 
			+ work.download_link + '")', function(err, result) {
			if (err) {
				console.log("Error has occured during creation of user " + username);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": "ERRDBCONNECTION"
				})
				return
			}
			var id = result.insertId;
			if (preview) {
				if (preview.mimetype == "image/jpeg" && preview.size <= 5242880) {
					fs.rename(preview.path, 'src/public/img/uploads/previews/' + id + ".jpg", function (err) {
						if (err) console.log(err);
					}); 
				} else {
					fs.unlink(preview.path, (err) => {
						if (err) console.log(err);
					})
					res.json({
						"ok": false,
						"error": "INCORRECTIMAGE"
					})
					return;
				}
			}
			req.files.images.forEach(el => {
				if (el.mimetype == "image/jpeg" && el.size <= 5242880) {
					pool.query("INSERT INTO `images`(`owner_type`, `owner_id`) VALUES ('work', " + id + ")", (err, result) => {
						fs.rename(el.path, 'src/public/img/uploads/images/' + result.insertId + ".jpg", function (err) {
							if (err) console.log(err);
						});
					}) 
				} else {
					fs.unlink(el.path, (err) => {
						if (err) console.log(err);
					})
					res.json({
						"ok": false,
						"error": "INCORRECTIMAGE"
					})
					return;
				}
			});
			console.log("Succesfully created work " + owner_id + " - " + title);
			res.json({
				"ok": true
			});
		});
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});
//Возможно нужны альтернативные способы поиска работ
router.get("/work/get/:id", (req, res, next)=> {
	try {
		const id = req.params.id;
		global.pool.query("SELECT * FROM `works` WHERE `id` = " + id, function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during finding work with id: " + id);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": "ERRDBCONNECTION"
				});
				return
			}
			res.json({
				"ok": true,
				"result": JSON.stringify(rows)
			});
		});
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});
router.get("/work/user/:id", (req, res, next)=> {
	try {
		const id = req.params.id;
		global.pool.query("SELECT * FROM `works` WHERE `owner_id` = " + id, function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during searching works by user-id: " + id);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": "ERRDBCONNECTION"
				});
				return
			}
			res.json({
				"ok": true,
				"result": JSON.stringify(rows)
			});
		});
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});
router.put("/work/update/:id", (req, res, next)=> {
	try {
		if (req.session.user == undefined) {
			res.json({
				"ok": false,
				"error": "ERRNOTLOGGEDIN"
			});
			return
		}
		var work = req.body;
		const work_id = req.params.id; 
		const user_id = req.session.user.id;
		global.pool.query("UPDATE `works` SET " + 
			"`username` = '" + user.username + "', " +
			"`email` = '" + user.email + "', " +  
			"`name` = '" + user.name + "', " + 
			"`surname` = '" + user.surname + "', " + 
			"`about` = '" + user.about + "' " + 
			"WHERE `id` = " + work_id + " AND `owner_id` = " + user_id, function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during updating work with id: " + work_id);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": "ERRDBCONNECTION"
				});
				return
			}
			res.json({
				"ok": true
			});
		});
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});
router.delete("/work/delete/:id", (req, res, next)=> {
	try {
		res.send("Удаление работы (только по id)");
		next();	
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});
router.get("/img/delete/:id", (req, res, next)=> {
	try {
		global.pool.query("SELECT * FROM `works` WHERE `id` = " + req.params.id, (err, rows, fields) => {
			if (err) {
				console.log("Error has occured during deleting img with id: " + req.params.id);
				console.log("Error: \n" + err + "\n");
				res.json({
					"ok": false,
					"error": "ERRDBCONNECTION"
				});
				return
			}
			if (rows[0] = undefined) {
				res.json({
					"ok": false,
					"error": "IMGNOTEXIST"
				});
				return	
			} 
			global.pool.query("DELETE FROM `images` WHERE `id` = " + req.params.id, (err) => {
				if (err) {
					console.log("Error has occured during deleting img with id: " + req.params.id);
					console.log("Error: \n" + err + "\n");
					res.json({
						"ok": false,
						"error": "ERRDBCONNECTION"
					});
					return
				}	
				res.json({
					"ok": true
				});	
			});
		})
	} catch (error) {
		res.json({
			"ok": false,
			"error": "UNKNOWNERROR"
		});
		console.log(error)
		next(error)	
	}
});

module.exports = router;
