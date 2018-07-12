console.log("log.js loaded...");
const fs = require('fs');
const dateFormat = require('dateformat');

var filename = (date) => {
  return date + ".log";
};

var saveLogEntry = (logString) => {
  let date = dateFormat(new Date(), "mediumDate");
  let filePath = "./logs/" + filename(date);

  fs.appendFile( filePath, logString, (err) => {
    if (err) throw err;
    console.log('Event Logged [' + date + ']');
  });
};

var generateEntry = (req, mailSent) => {
  if(mailSent == "true") { mailSent = mailSent + " "; }
  let permittedLength = 100;

  let lineOne = "Success: " + mailSent +
              " ### name: " + req.body.name +
               " | email: " + req.body.email +
               " | phone: " + req.body.phone +
            " | hostname: " + req.hostname +
          " | ip address: " + req.ip + "\n";

  let lineTwoPrefix = "# message: ";
  let lineTwoPostfix = "...\n\n";
  let messageLength = permittedLength - lineTwoPrefix.length - lineTwoPostfix.length;
  let message = req.body.message.slice(0, messageLength);
  let lineTwo = lineTwoPrefix + message + lineTwoPostfix;

  return lineOne + lineTwo;
};

module.exports = {
  generateEntry: generateEntry,
  saveLogEntry: saveLogEntry
};
