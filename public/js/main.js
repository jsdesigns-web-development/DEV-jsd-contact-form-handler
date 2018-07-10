$('#domain').val(location.hostname);

var removeExpired = (record) => {
  let validRecords = [];
  let rightNow = Date.now();
  let oneDay = 86400000;
  let oneMinute = 60000;

  for(x=0; x < record.length; x++) {
    let age = rightNow - record[x].timestamp;
    if( age <= oneDay ){
      validRecords.push(record[x]);
    }
  }

  return validRecords;
};

var saveRecord = function(existingRecord, formData){
  let formDataArray = new Array();

  if(existingRecord == null) {
    formDataArray = [formData];
  } else {
    formDataArray = removeExpired(existingRecord);
    formDataArray = formDataArray.concat(formData);
  }

  localStorage.setItem("record", JSON.stringify(formDataArray));
};

var lessThanTwoMinAgo = function(record) {
  if(record == null) { return false; }

  let rightNow = Date.now();
  let twoMinutes = 120000;

  for(x=0; x < record.length; x++) {
    let age = rightNow - record[x].timestamp;
    if( age <= twoMinutes ){
      return true;
    }
  }
  return false;
};

var moreThanFivePerDay = function(record) {
  if(record == null) { return false; }

  //if maximum number of submissions already reached, then disable submit
  if(record.length >= 5) {
    return true;
  }
  return false;
};


var trySubmit = function(){
  let formInputs = {
    name: $("#name").val(),
    email: $("#email").val(),
    phone: $("#phone").val(),
    message: $("#message").val(),
    domain: $("#domain").val(),
    timestamp: Date.now()
  }

  let existingRecord = JSON.parse(localStorage.getItem("record"));
  let allowSend = false;
  var alertMessage = "";
  let alertDismissCode = "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>"
  let tooManyRecentlyMessage = alertDismissCode + "<strong>You just sent a message.</strong> Please wait a couple minutes before trying again.";
  let oneDayLimitMessage = alertDismissCode + "<strong>Message Limit Reached.</strong> Please wait 24 hours before trying again.";
  let wasTwoMinAgo = lessThanTwoMinAgo(existingRecord);
  let fiveTimesToday = moreThanFivePerDay(existingRecord);

  if ( wasTwoMinAgo || fiveTimesToday ) {
    if(wasTwoMinAgo){
      alertMessage = tooManyRecentlyMessage;
    } else {
      alertMessage = oneDayLimitMessage;
    }
  } else {
    allowSend = true;
  }

  if (allowSend) {
    $('#contact-form').submit();
    saveRecord(existingRecord, formInputs);
    $("#alert-bar-success").show();
  } else {
    $("#submit-button").val("Uh-Oh!");
    $("#alert-bar").html(alertMessage);
    $("#alert-bar").show();
  }

};
