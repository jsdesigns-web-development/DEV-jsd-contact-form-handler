#!/usr/bin/env node
const express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const ejs = require('ejs');
var mail = require('./lib/mail.js');
var inputs = require('./lib/inputs.js');

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/modules', express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

var dbServer = 'ds229690.mlab.com:29690/contact_form';
var dbUsername = 'bjsd'; // env
var dbPassword = 'iAN2I5s67Mme3tr6ni'; // env

mongoose.connect('mongodb://' + dbUsername + ':' + dbPassword + '@' + dbServer);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connection to db established.');
});

// Define Schema
var contactSchema = mongoose.Schema({
  //host_detected: String,
  domain: String,
  address: Array,
  smtp: {
    default: Boolean,
    host: String,
    port: String,
    secure: Boolean,
    smtp_auth_user: String,
    smtp_auth_pass: String
  }
});

// Compile Schema to Model
var Contacts = mongoose.model('Contacts', contactSchema);

app.get('/', function(req, res) {
  res.render("index");
});

app.post('/contact', function(req, res) {
  if(inputs.validate(req.body)){
    var mailSent = mail.transmit(req.body);
  }

  res.send(
    {
      sent: mailSent,
      data: req.body
    });
});

app.listen(3000, () =>
  console.log('Initialization Complete: server listening on port 3000')
);
