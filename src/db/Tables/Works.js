const sql = require('../connection.js');

const Works = function() {
	sql.connect();
	sql.connection.query(`CREATE TABLE IF NOT EXISTS works (
			id int(12) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			title varchar(100) NOT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_modified datetime
		);`, (err, res) => {
			if(err) console.log(err);
	});
	sql.end();
}

module.exports = Works;
