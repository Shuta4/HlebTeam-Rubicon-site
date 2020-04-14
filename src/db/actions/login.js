const sql = require("../connection.js");

module.exports = function(username, password) {
	if (username && password) {
		var user = getUserInfo(username, username);
		if (!user.exist || !user.ok) return false;
		if (user.result.password == password) return user.result;
		else return false;
	} else return false
}