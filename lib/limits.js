var limitTracker = require('./lib/limit_tracker.js');

const RECENT_LIMIT = 120000;    // in ms (two minutes)
const DAILY_LIMIT = 5;          // submissions per day per visitor
const DOMAIN_LIMIT = 100;       // allowed contact emails per day per domain

var isRecentLimitReached = (hash) => {
  // loop through limitList and match hash
  // if match found, test if limitList age < RECENT_LIMIT
  return false;
};

var isDailyLimitReached = (hash) => {
  // loop through limitList and tally (hash.clientID OR hash.hash ) >= DAILY_LIMIT
  return false;
};

var isDailyDomainLimitReached = (hash) => {
  // loop through limitList and tally hashes for hash.domain
  return false;
};

var limitsAreOK = (tempHash) => {
  // clear out expired hashes
  limitTracker.clearOutExpired();
  // is recent limit reached
  let recent = isRecentLimitReached(tempHash);
  // is daily limit reached
  let daily = isDailyLimitReached(tempHash);
  // is daily domain limit reached
  let domain = isDailyDomainLimitReached(tempHash);
  // if all limits are false, then save temphash to list and return true else false
  if (recent && daily && domain) {
    return false;
  } else {
    limitTracker.save(tempHash);
    return true;
  }
};


module.exports = {
  areOK: limitsAreOK
};
