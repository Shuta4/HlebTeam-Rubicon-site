const sql = require('../connection.js');

const Images = function() {
	connection = sql.connection();
	sql.connect(connection);
	connection.query(`CREATE TABLE IF NOT EXISTS images (
			id int(20) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			image MEDIUMBLOB NOT NULL
		);`, (err, res) => {
			if(err) console.log("Error with creating table!\n" + err);
			else console.log("Table 'images' was successfully created or already exists!");
		});
	sql.end(connection);
}

module.exports = Images;
