const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/modules', express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

// Enabling cross-origin resource sharing
//  this prevents ajax from throwing a client-side error
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(require('./routes/index'));


var server = app.listen(port, function () {
  console.log("\n/********************************************/");
  console.log('\tServer is listening on port ' + port + '!');
  if(port == 3000){console.log('\thttp://localhost:3000/')};
  console.log("/********************************************/\n");
});
