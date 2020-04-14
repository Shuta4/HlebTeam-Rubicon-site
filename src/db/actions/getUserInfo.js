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
	var result = {
		ok: false,
		exist: false,
		result: null,
		error: null	
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
		try {
			if (rows) result = {
				ok: true,
				exist: true,
				result: rows[0],
				error: null
			};
			else result = {
				ok: true,
				exist: false,
				result: null,
				error: null
			};		
		} catch (err) {
			result = {
				ok: false,
				exist: false,
				result: null,
				error: "Unexprected error"
			}	
		}
		console.log("Succesfully checked user " + username + " - " + email + ". Result is " + result.exist);
		console.log(rows)
	});
	sql.end(connection);
	return result;
}