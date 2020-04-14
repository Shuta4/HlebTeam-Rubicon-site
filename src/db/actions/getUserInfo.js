const sql = require("../connection.js");

module.exports = function(username, email) {
	if(username == "" && email == "") {
		console.log("Check user fail because no parametrs!");
		return {
			ok: false,
			exist: false,
			result: null,
			error: "No parametrs"
		};
	}
	connection = sql.connection();
	sql.connect(connection);
	connection.query('SELECT * FROM users WHERE users.email = "' + email + '" OR users.username = "' + username + '" ', function(err, rows, fields) {
		if (err) {
			console.log("Error has occured during checking of user " + username + " - " + email);
			console.log("Error: \n" + err + "\n");
			return {
				ok: false,
				exist: false,
				result: null,
				error: err
			};
		}
		// if (rows[0].id) result = {
		// 		ok: true,
		// 		exist: true,
		// 		result: rows[0],
		// 		error: null
		// 	};
		// else result = {
		// 		ok: true,
		// 		exist: false,
		// 		result: null,
		// 		error: null
		// 	};
		//console.log("Succesfully checked user " + username + " - " + email + ". Result is " + result.exist);
		console.log(rows)
		console.log(fields)
	});
	sql.end(connection);
	result = {ok: true}
	return result;
}