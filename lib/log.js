console.log("log.js loaded...");
const fs = require('fs');
const dateFormat = require('dateformat');

var filename = (date) => {
  return date + ".log";
};

var saveEntry = (logString) => {
  let date = dateFormat(new Date(), "mediumDate");
  let filePath = "./logs/" + filename(date);

  fs.appendFile( filePath, logString, (err) => {
    if (err) throw err;

    console.log(
      'Event Logged {' +
        dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") +
          "}");
  });
};

var generateEntry = (req, sendMailResult) => {
  let permittedLength = 100;
  //if(sendMailResult == true) { sendMailResult = sendMailResult + " "; }
  let date = dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
  let result =  sendMailResult ? "SUCCESS" : "FAILED ";

  let lineOne = result + " | " + date + "\n";

  let lineTwo =   "# name: " + req.body.name +
                 " | email: " + req.body.email +
                 " | phone: " + req.body.phone +
              " | hostname: " + req.hostname +
            " | ip address: " + req.ip + "\n";

  let lineThreePrefix = "# message: ";
  let lineThreePostfix = "...\n\n";

  let messageLength = permittedLength - lineThreePrefix.length - lineThreePostfix.length;
  let message = req.body.message.slice(0, messageLength);

  let lineThree = lineThreePrefix + message + lineThreePostfix;
  return lineOne + lineTwo + lineThree;
};

var logFileArchiver = () => {
  /*
    This function will keep a record of each log file's age.
    Logs older than 90 days should be tarred and compressed
    into a .tgz file with node-tar npm module. The gzip file
    can then be copied to at S3 bucket and the source files deleted.
  */
};

module.exports = {
  generateEntry: generateEntry,
  saveEntry: saveEntry
};
