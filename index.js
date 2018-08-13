#!/usr/bin/env node
"use strict";
const nodeMailer = require('nodemailer');
const validator = require('validator');
const Database = require("../lib/db.js");

class Mailer {
  constructor() {
    this.DB = new Database.contactsDB();
    this.emailServiceUser = process.env.EMAIL_SERVICE_USER;
    this.emailServicePass = process.env.EMAIL_SERVICE_PASS;

    /*
      // EMAIL ADDRESS VALIDATION
      this.emailRegex
        = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    */

    // TRANSPORTER CONFIGURATION
    this.transporter = nodeMailer.createTransport({
      host: 'smtp-relay.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: this.emailServiceUser,
          pass: this.emailServicePass
      }
    });

    // MESSAGE DETAILS
    this.mailOptions = {
      from: '"CONTACT FORM" <contact_form@jsdesigns.site>', // sender address
      to: "brianjason@gmail.com", // list of receivers
      subject: "CONTACT FORM MESSAGE: ", // Subject line
      text: "TEST", // plain text body
      html: "<b>TEST</b>" // html body
    };

  }
  // VALIDATE FORM DATA
  validate(formData) {
   if (!this.emailServiceUser) return [false, 'EMAIL_SERVICE_USER env var not set'];
   if (!this.emailServicePass) return [false, 'EMAIL_SERVICE_PASS env var not set'];

   let objectKeys = Object.keys(formData);

   objectKeys.forEach( (item)=>{
     if (!validator.isAscii(formData[item])) return [false, 'Form data invalid.'];
   } );

   if (!validator.isEmail(formData.email)/*!this.emailRegex.test(from)*/) {
     return [false, 'Not a valid email address'];
   }
   return [true, ''];
 }

  composeMessage(formData, type) {
    let messageArray = [];
    let paramKeys = Object.keys(formData);

    function moveMessageToLast(myArray) {
      let paramkeys = myArray;
      let messageIndex = paramKeys.indexOf("message");
      let messageTmp = paramkeys[messageIndex];
      paramkeys.splice(messageIndex, 1);
      paramkeys.push(messageTmp);

      return paramkeys;
    };

    function findAndRemove(myArray, item) {
      let itemIndex = myArray.indexOf(item);
      myArray.splice(itemIndex, 1);
      return myArray;
    };

    paramKeys = findAndRemove(paramKeys, "session");
    paramKeys = findAndRemove(paramKeys, "clientID");
    paramKeys = moveMessageToLast(paramKeys);

    paramKeys.forEach((item)=>{
      let htmlString = "<b>" + item + "</b>: " + formData[item] + "<br>";
      let textString = "" + item + ": " + formData[item];
      messageArray.push((type == "html") ? htmlString : textString);
    });

    //console.log(messageArray);
    return messageArray.join("\n");
  }

  lookupRecipient(domain) {
    if(domain == "localhost") {
      return this.emailServiceUser;
    } else {
      return false;
    }
  }

  send() {
    let transporter = this.transporter;
    let mailOptions = this.mailOptions;

    transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
          });

    return true;
  }
}


module.exports = {
  init: Mailer
}
