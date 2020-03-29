const mysql = require("mysql");

var sql = {
	connection: function() {
		return mysql.createConnection({
		  host: 'localhost',
		  user: 'hlebteam',
		  password: 'password',
		  database: 'hlebteam'
		});
	},
	connect: function(conn) {
			conn.connect((err) => {
			console.log("Error with connecting to db!");
			console.log("ERROR: " + err);
		})
	},
	end: function(conn) {
			conn.end((err) => {
			console.log("Error with ending connection to db!");
			console.log("ERROR: " + err);
		})
	}
}

module.exports = sql;