'use strict';
var mongoose = require('mongoose');

class DB {
  constructor() {
    // DATABASE INIT
    this.server = process.env.CONTACT_FORM_DB_ADDRESS;
    this.username = process.env.CONTACT_FORM_DB_USER_READONLY;
    this.password = process.env.CONTACT_FORM_DB_PASS_READONLY;

    mongoose.connect('mongodb://' + this.username + ':' + this.password + '@' + this.server, { useNewUrlParser: true });
    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', function() {
      console.log('connection to db established.');
    });
    // Define Schema
    this.contactSchema = mongoose.Schema({
      //host_detected: String,
      domain: String,
      address: Array,
      smtp: {
        default: Boolean,
        host: String,
        port: String,
        secure: Boolean,
        smtp_auth_user: String,
        smtp_auth_pass: String
      }
    });

    // Compile Schema to Model
    this.Contacts = mongoose.model('Contacts', this.contactSchema);
  }
}

module.exports = { contactsDB: DB};
