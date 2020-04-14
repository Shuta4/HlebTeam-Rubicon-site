const sql = require("../connection.js");

module.exports = function(username, email, password) {
	if ((username || email) && password) {
		user = getUserInfo(username, email);
		if (!user.exist || !user.ok) return false;
		if (user.result.password == password) return user.result;
		else return false;
	} else return false
}