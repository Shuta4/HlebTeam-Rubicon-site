const express = require('express');
const Works = require('./db/Tables/Works.js')

const port = 4000;
const app = express();

const sql = require('./db/connection')

sql.connect();
sql.end();

Works();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

app.use("/api", require("./api.js"));
app.use("/", require("./pages.js"));

app.listen(port);
console.log("Server are running on port: " + port);