var submitFormData = function(formInputs) {
  $.post( "/contact", formInputs)
  .done(function( response ) {
    //alert( "Data Loaded: " + data );
    console.log( response );
  });
};
