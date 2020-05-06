const express = require('express');
const cookieParser = require('cookie-parser');
const cookie = require('express-session');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const port = 4000;
const app = express();

const sql = require('./db/connection');

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  cookie: { maxAge: 3600000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));

app.use("*", (req, res, next) => {
	try {
		console.log("Middleware")
		if (req.session.user == undefined) {
			next();
			return	
		}
		connection = sql.connection();
		sql.connect(connection);
		var id = req.session.user.id;
		connection.query("SELECT * FROM `users` WHERE `id` = " + id + "", function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during checking user: " + id);
				console.log("Error: \n" + err + "\n");
				next();
				return
			}
			if (rows[0] != undefined) {
				if (rows[0].id != undefined || rows[0].id != null) 
					req.session.user = rows[0];
				else req.session.destroy();
				next();	
			} 
		});
		sql.end(connection);
	} catch (error) {
		console.log(error);
		next(error);
	}
});
app.use("/api", require("./api.js"));
app.use("/", require("./pages.js"));

// Обработка 404
app.get("*", (req, res, next) => {
	if (!res.headersSent) {
		res.status(404).render('./pages/error404');
		console.log("404 Error");
	}
    return;
});
// Обработка 500
app.use((err, req, res, next) => {
	console.log(err);
	if (!res.headersSent) res.status(500).render('./pages/error500');
});

app.listen(port, () => console.log("Server are running on port: " + port));
