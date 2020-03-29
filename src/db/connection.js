const mysql = require("mysql");

var sql = {
	connection: function() {
		mysql.createConnection({
		  host: 'localhost',
		  user: 'hlebteam',
		  password: 'password',
		  database: 'hlebteam'
		});
	},
	connect: function(connection) {
			connection.connect((err) => {
			console.log("Error with connecting to db!");
			console.log("ERROR: " + err);
		})
	},
	end: function(connection) {
			connection.end((err) => {
			console.log("Error with ending connection to db!");
			console.log("ERROR: " + err);
		})
	}
}

module.exports = sql;