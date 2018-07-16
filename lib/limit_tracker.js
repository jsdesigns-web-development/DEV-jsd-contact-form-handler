/*

tempHash = { "all": allHash, "email": emailHash, "message": messageHash, "timestamp": Date.now()}
hashList = { "all": allHash,
             "email": emailHash,
             "message": messageHash,
             "timestamp": Date.now()
}
hashTally = {}

GOAL:
  check hashes against ruleset
  if check passes -> save hashes

1) remove expired in hashList
*/

var hashList = [];
var clearOutExpired = () => {};
var save = (tmp) => {
  console.log("tempHash saved...")
};




module.exports = {
  clearOutExpired: clearOutExpired,
  save: save
};






//############################################################################

var removeExpired = (type, quantity) => {
  /*
  let list = hashList.filter( hash => hash[type] > quantity);
  if(list.length < hashList.length) { hashList = list; }

  return (hashList.length - list.length);
  */
};

var checkForExisting = (hashArray) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  let result = [0, 0, 0];

  for(x=0; x > hashList.length-1; x++){
    if(hashList[x]["hash"] == hashArray[0]) {
      // all
      result[0] += 1;
    }
    if(hashList[x]["hash"] == hashArray[1]) {
      // email
      result[1] += 1;
    }

    if(hashList[x]["hash"] == hashArray[2]) {
      // message
      result[2] += 1;
    }
  }

  return (result.reduce(reducer) > 0) ? true : false;
};

var save = (hash, type) => {
  hashList += {
    "hash": hash,
    "type": type,
    "timestamp": new Date()
  }
};


/*
var hashExists = (hashStr, type) => { return false };
let allHashExists = hashExists(allHash, "all");
let emailHashExists = hashExists(emailHash, "email");
let messageHashExists = hashExists(messageHash, "message");
*/
