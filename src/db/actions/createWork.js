module.exports = function(owner_id, title, description, preview_img, download_link) {
	connection = sql.connection();
	sql.connect(connection);
	connection.query('INSERT INTO `works`(`owner_id`, `title`, `description`, `preview_img`, `download_link`) VALUES (' + owner_id + ',"' + title + '","' + description + '","' + preview_img + '","' + download_link + '")', function(err) {
		if (err) {
			console.log("Error has occured during creation of user " + username);
			console.log("Error: \n" + err + "\n");
			return
		}
		console.log("Succesfully created work " + owner_id + " - " + title);
	});
	sql.end(connection);
}
