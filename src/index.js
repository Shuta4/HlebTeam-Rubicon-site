const express = require('express');

const port = 4000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.get("/", (req, res) => {
  res.render("./pages/index");
})
app.listen(port);
console.log("Server are running on port: " + port);
