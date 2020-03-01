const express = require('express');

const port = 4000;
const server = express();

server.use(express.static(__dirname + '/public'));
server.get("/", function(req, res) {
  console.log("Something was catched!" + req.method);
  res.sendFile('public/pages/index.html', {root: __dirname });
});

server.listen(port)
console.log("Server are running on port: " + port);
