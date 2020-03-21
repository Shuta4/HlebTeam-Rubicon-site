const express = require('express');

const port = 4000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.get("/", (req, res, next) => {
  res.render("./pages/index");
  next();
});
app.get("/userpage", (req, res, next) => {
  res.render("./pages/user_page");
  next();
});
app.listen(port);
console.log("Server are running on port: " + port);
