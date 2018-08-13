#!/usr/bin/env node
const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const uniqid = require('uniqid');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var mail = require('./lib/mail.js');
var inputs = require('./lib/inputs.js');
var log = require('./lib/log.js');
var hash = require('./lib/hash.js');
var limits = require('./lib/limits.js');

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/modules', express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

var dbServer = process.env.CONTACT_FORM_DB_ADDRESS;
var dbUsername = process.env.CONTACT_FORM_DB_USER;
var dbPassword = process.env.CONTACT_FORM_DB_PASS;

mongoose.connect('mongodb://' + dbUsername + ':' + dbPassword + '@' + dbServer, { useNewUrlParser: true });

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


// ROUTES
app.get('/', function(req, res) {
  res.render("index");
});

app.post('/contact', function(req, res) {
  var okToSend = false;
  var inputsOK = false;
  var limitsOK = false;
  var msgSent = false;
  var formData = req.body;

  var clientID = (req.body.clientID == "0") ? uniqid() : req.body.clientID;

  // 0-A track status (init)
  var getStatus = () => {
    return {
      "inputsOK": inputsOK,
      "domainOK": domainOK,
      "limitsOK": limitsOK,
      "msgSent": msgSent,
      "clientID": clientID
    }
  };

  // 0-B validate domain
  if(formData.session != formData.domain) {
    res.send(getStatus());
  } else {
    domainOK = true;
  }

  // 1) validate req inputs
  if(!inputs.validated(formData)) {
    res.send(getStatus());
  } else {
    inputsOK = true;
  }

  // 2) check against rule set (min, day, domain)
    //hash inputs -> temp hash
      // {"all": xxx, "email": xxx, "message": xxx, "timestamp": new Date()}
  var tempHash = hash.hashifyInputs(formData);
    //check hashes against ruleset
    // if check passes -> save hashes
  if(!limits.areOK(tempHash)) {
    res.send(getStatus());
  } else {
    limitsOK = true;
  }
  // 3) lookup recipient email address in db
  // 4) transmit data to recipient
  // 5) log outcome
  var logEntry = log.generateEntry(req, mailSent);
  log.saveEntry(logEntry);

  // 6) return result to client
  res.send(getStatus());


/*
let okToSend = mail.isOkToSend(req.body);
  if(inputs.validated(req.body) && okToSend[0]){
    let mailSent = mail.transmit(req.body);
  } else {
    let mailSent = okToSend[0];
    // also pass okToSend[1] outcomes
  }
*/

});

app.listen(3000, () =>
  console.log('Initialization Complete: server listening on port 3000')
);
