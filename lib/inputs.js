console.log("inputs.js loaded...");

var checkEmail = (email) => {
  return true;
};

var checkPhone = (phone) => {
  return true;
};

var checkDomain = (domain) => {
  return true;
};

var validate = (formData) => {
  if(checkEmail(formData.email) && checkPhone(formData.phone)
     && checkDomain(formData.domain)) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  validate: validate
};
