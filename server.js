const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/modules', express.static('node_modules'));
app.use(require('./routes/index'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

var server = app.listen(port, function () {
  console.log("\n/********************************************/");
  console.log('\tServer is listening on port ' + port + '!');
  if(port == 3000){console.log('\thttp://localhost:3000/')};
  console.log("/********************************************/\n");
});
