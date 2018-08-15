#!/usr/bin/env node
"use strict";

const nodeMailer = require('nodemailer');
const validator = require('validator');

class Mailer {
  constructor(dbClass) {
    this.formData = {};
    this.DB = dbClass;
    this.emailServiceUser = process.env.EMAIL_SERVICE_USER;
    this.emailServicePass = process.env.EMAIL_SERVICE_PASS;

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
      to: "contact_form@jsdesigns.site", // list of receivers
      subject: "MESSAGE RECEIVED from your website's contact form", // Subject line
      text: "empty message", // plain text body
      html: "empty message" // html body
    };
  }
  // VALIDATE FORM DATA
  validate(formData) {
   if (!this.emailServiceUser) return [false, 'EMAIL_SERVICE_USER env var not set'];
   if (!this.emailServicePass) return [false, 'EMAIL_SERVICE_PASS env var not set'];

   let objectKeys = Object.keys(formData);

   objectKeys.forEach((item)=>{
     if (!validator.isAscii(formData[item])) return [false, 'Form data invalid.'];
   });

   if (!validator.isEmail(formData.email)) {
     return [false, 'Not a valid email address'];
   }

   return [true, ''];
 }

  composeMessage(formData, type) {
    let paramKeys = Object.keys(formData);
    let messageArray = [];

    messageArray.push(
      (type == "html") ? "<b>=== Message ===</b><br>" : "=== Message ==="
    );

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
    paramKeys = findAndRemove(paramKeys, "timestamp");
    paramKeys = moveMessageToLast(paramKeys);

    paramKeys.forEach((item)=>{
      let htmlString = "<b>" + item + "</b>: " + formData[item] + "<br>";
      let textString = "" + item + ": " + formData[item];
      messageArray.push((type == "html") ? htmlString : textString);
    });

    return messageArray.join("\n");
  }

  send(recipientEmail) {
    this.mailOptions.to = recipientEmail;
    this.mailOptions.subject = "[ " + this.formData.domain + " ] " +
      this.formData.email + " has sent you a message";

    this.transporter.sendMail(this.mailOptions, (error, info) => {
          if (error) { return console.log(error) }
          console.log('Message %s sent: %s', info.messageId, info.response);
        });

    return true;
  }
}

module.exports = { init: Mailer };

/*
  // EMAIL ADDRESS VALIDATION
  this.emailRegex
    = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
*/
