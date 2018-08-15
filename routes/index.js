'use strict';

const express = require('express');
const bodyParser = require("body-parser");

const router = express.Router();
const Database = require("../lib/db.js");
const Mailer = require("../lib/");
const Log = require('../lib/log.js');

var db = new Database.contactsDB();
var mailer = new Mailer.init(db);

router.use(function timeLog(req, res, next) {
  next();
});

router.post('/contact', function(req,res, next) {
  console.log("message submitted")
  mailer.formData = req.body;

  db.Contacts.find(function(err, domain){
    console.log(mailer.formData.domain);
    //db.Contacts -- START
    let recipientEmailAddress = domain[0].address[0];

    // COMPOSE MESSAGE STRING
    if(req.body.message.trim() != "" || !req.body.message) {
      mailer.mailOptions.text = mailer.composeMessage(req.body, "text");
      mailer.mailOptions.html = mailer.composeMessage(req.body, "html");
    }

    // EMAIL FORM DATA TO RECIPIENT
    var result = mailer.send(recipientEmailAddress);

    // LOG RESULTS
    var logEntry = log.generateEntry(req, mailSent);
    log.saveEntry(logEntry);

    // SEND RESPONSE TO CLIENT
    res.send((result) ? ('Message sent to ' + recipientEmailAddress) : 'Message not sent.');
    //db.Contacts -- END
  });

  /*
  // VALIDATE EMAIL
  let validEmail = mailer.validate(req.body);
  if (!validEmail[0]) { console.error(validEmail[1]) }
  */


  /*
  if (!recipient) {
    console.error("ERROR: " + req.body.domain + " domain does not exist")
  }
  */



  // LOG RESULTS
  /*
  var logEntry = log.generateEntry(req, mailSent);
  log.saveEntry(logEntry);
  */

  /*
  console.log(result);
  */
  //res.send((result) ? 'message sent' : 'message failed. message not sent.');
});

module.exports = router;
