const sql = require("../connection.js");

module.exports = function(username, password) {
	if (username && password) {
		connection = sql.connection();
		sql.connect(connection);
		connection.query('SELECT * FROM users WHERE users.email = "' + username + '" OR users.username = "' + username + '"', function(err, rows, fields) {
			if (err) {
				console.log("Error has occured during loginning of user " + username);
				console.log("Error: \n" + err + "\n");
				return false
			}
		});
		sql.end(connection);
	} else return false
}