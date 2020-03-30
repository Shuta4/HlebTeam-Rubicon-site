const sql = require('../connection.js');

const Users = function() {
	connection = sql.connection();
	sql.connect(connection);
	connection.query(`
			CREATE TABLE IF NOT EXISTS users (
			id int(12) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			name varchar(50) NOT NULL,
			surname varchar(50) NOT NULL,
			about varchar(1000),
			avatar varchar(20),
			birthday datetime NOT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
		);`, (err, res) => {
			if(err) console.log("Error with creating table!\n" + err);
			else console.log("Table 'users' was successfully created or already exists!");
		});
	sql.end(connection);
}

module.exports = Users;
