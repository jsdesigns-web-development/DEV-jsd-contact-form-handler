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
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Event Logged [' + date + ']');
  });
};

var generateEntry = (req, mailSent) => {
  return "generic entry\n";
};

module.exports = {
  generateEntry: generateEntry,
  saveLogEntry: saveLogEntry
};
