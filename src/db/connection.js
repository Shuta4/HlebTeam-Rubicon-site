const mysql = require("mysql2");

var sql = {
	connection: function() {
		return mysql.createConnection({
		  host: 'localhost',
		  user: 'hlebteam',
		  password: 'password',
		  database: 'hlebteam'
		})
	},
	pool: function() {
		return mysql.createPool({
			connectionLimit: 10,
			host: 'localhost',
			user: 'hlebteam',
			password: 'password',
			database: 'hlebteam'
		})
	},
	connect: function(connection) {
		connection.connect((err) => {
			if (err) {
				console.log("Error with connecting to db!");
				console.log("ERROR: " + err);
			}
			//else console.log("Successfully connected!")
		})
	},
	end: function(connection) {
		connection.end((err) => {
			if (err) {
				console.log("Error with ending connection to db!");
				console.log("ERROR: " + err);
			}
			//else console.log("Successfully ended connection!")
		})
	}
}

module.exports = sql;