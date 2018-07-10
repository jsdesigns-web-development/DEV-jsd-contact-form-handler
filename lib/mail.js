console.log("mail.js loaded...");

// limit submission to once every 2 minutes per user
// limit submissions to 5x per day per user

// limit submissions 20 per day per domain

var transmit = (formData) => {
  return true;
};

module.exports = {
  transmit: transmit
};
