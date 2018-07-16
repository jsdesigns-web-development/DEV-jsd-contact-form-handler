// TODO: Pull hashing code from past program to make generateHash() work.

var generateHash = (hashStr) => {
  // creates hash from parameter (string)
  return hashStr.split("").reverse().join("");
}

var hashAllData = (data) => {
  let name = data.name;
  let email = data.email;
  let phone = (!data.phone || data.phone == null) ? "" : data.phone;
  let message = data.message;
  let domain = data.domain;

  let preHashString = name + email + phone + message + domain;

  return generateHash(preHashString);
};

var hashifyInputs = (data) => {
  // hash all data {data == req.body}
  let allHash = hashAllData(data);
  // hash email address
  let emailHash = generateHash(data.email);
  // hash message
  let messageHash = generateHash(data.message);

   return {
     "all": allHash,
     "email": emailHash,
     "message": messageHash,
     "timestamp": Date.now()
   }
};

module.exports = {
  hashifyInputs: hashifyInputs
}
