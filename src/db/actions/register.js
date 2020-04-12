const sql = require("../connection.js");

module.exports = function(username, email, password) {
	connection = sql.connection();
	sql.connect(connection);
	connection.query("INSERT INTO `users`(`username`, `email`, `password`) VALUES ('" + username + "', '" + email + "', '" + password + "')", function(err) {
		if (err) {
			console.log("Error has occured during creation of user " + username);
			console.log("Error: \n" + err + "\n");
			return
		}
		console.log("Succesfully created user " + username);
	});
	sql.end(connection);
}