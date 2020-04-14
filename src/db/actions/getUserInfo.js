const sql = require("../connection.js");

module.exports = async function(username, email) {
	if(username == "" && email == "" || username == undefined && email == undefined) {
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
	var result = await connection.query('SELECT * FROM users WHERE users.email = "' + email + '" OR users.username = "' + username + '" ', function(err, rows, fields) {
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
			if (rows) return {
				ok: true,
				exist: true,
				result: rows[0],
				error: null
			};
			else return {
				ok: true,
				exist: false,
				result: null,
				error: null
			};		
		} catch (err) {
			return {
				ok: false,
				exist: false,
				result: null,
				error: "Unexprected error"
			}	
		}
	});
	await console.log("Succesfully checked user " + username + " - " + email + ". Result is " + result);
	await sql.end(connection);
	return await result;
}