'use strict';

const express = require('express');
const bodyParser = require("body-parser");

const router = express.Router();
const Mailer = require("../lib/");
//const log = require('./lib/log.js');


router.use(function timeLog(req, res, next) {
  next();
});

router.post('/contact', function(req,res) {
  var mailer = new Mailer.init();

  // VALIDATE EMAIL
  let validEmail = mailer.validate(req.body);
  if (!validEmail[0]) { console.error(validEmail[1]) }

  // COMPOSE MESSAGE STRING
  var messageTXT = mailer.composeMessage(req.body, "text");
  var messageHTML = mailer.composeMessage(req.body, "html");
  //console.log(messageTXT);
  //console.log(messageHTML);

  // LOOKUP RECIPIENT
  var recipient = mailer.lookupRecipient(req.body.domain);
  if (!recipient) {
    console.error("ERROR: " + req.body.domain + " domain does not exist")
  }

  // EMAIL FORM DATA TO RECIPIENT
  /*
  var result = mailer.send();
  */

  // LOG RESULTS
  /*
  var logEntry = log.generateEntry(req, mailSent);
  log.saveEntry(logEntry);
  */

  // SEND RESPONSE TO CLIENT
  /*
  console.log(result);
  */
});

module.exports = router;
