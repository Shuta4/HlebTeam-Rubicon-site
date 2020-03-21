const mysql = require("mysql");

var connection = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'hlebteam-test'
	});

var sql = {
	connection: connection,
	connect: function() {
			connection.connect((err) => {
			console.log("Error with connecting to db!");
			console.log("ERROR: " + err);
		})
	},
	end: function() {
			connection.end((err) => {
			console.log("Error with ending connection to db!");
			console.log("ERROR: " + err);
		})
	}
}

module.exports = sql;