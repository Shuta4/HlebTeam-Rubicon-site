const sql = require('../connection.js');

const Works = function() {
	connection = sql.connection();
	sql.connect(connection);
	connection.query(`CREATE TABLE IF NOT EXISTS works (
			id int(12) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			title varchar(100) NOT NULL,
			description varchar(1000),
			preview_img varchar(20),
			images_arr varchar(1000),
			links_arr varchar(1000),
			download_link varchar(100),
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_modified datetime
		);`, (err, res) => {
			if(err) console.log("Error with creating table!\n" + err);
			else console.log("Table 'works' was successfully created or already exists!");
		});
	sql.end(connection);
}

module.exports = Works;
