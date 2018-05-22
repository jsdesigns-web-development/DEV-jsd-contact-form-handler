#!/usr/bin/env node
const express = require('express')
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
const ejs = require('ejs')

const app = express()

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/modules', express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

var dbServer = 'ds229690.mlab.com:29690/contact_form';
var dbUsername = 'bjsd'; // env
var dbPassword = 'iAN2I5s67Mme3tr6ni'; // env

mongoose.connect('mongodb://' + dbUsername + ':' + dbPassword + '@' + dbServer);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connection to db established.');
});

// Define Schema
var contactSchema = mongoose.Schema({
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
var Contacts = mongoose.model('Contacts', contactSchema);

app.get('/', function(req, res) {
  //console.log(req.headers.host);

  Contacts.find(function (err, contact) {
    if (err) return console.error(err);
    res.render("index", {contact: contact});
    })

});

// ADD contact
app.get('/add', function(req, res) {
  res.render("add");
})

app.post('/add', function(req, res, next) {
  // TODO: check if req.body.kitten_name already exists in db before adding to db
  //console.log(req.body.domain);
  //console.log(req.body.address);

  var newContact = new Contacts({
    //host_detected: req.headers.host,
    domain: req.body.domain,
    address: [req.body.address],
    smtp: {
      default: req.body.smtp_default,
      host: req.body.smtp_host,
      port: req.body.smtp_port,
      secure: req.body.smtp_secure,
      smtp_auth_user: req.body.smtp_auth_user,
      smtp_auth_pass: req.body.smtp_auth_pass
    }
  });
  console.log(newContact);

  // Save contact to db
  newContact.save(function (err, newContact) {
    if (err) return console.error(err);
  });
  res.redirect('/');

})


// EDIT contact
app.get('/edit/', function(req, res) {
  var contactId = req.query.contact_id;
  console.log(contactId);

  var query = Contacts.where({ _id: contactId });

  query.findOne( function (err, contact) {

    if(err) {
      console.error(err);
      res.redirect("/");
    } else {
      res.render("edit", {contact: contact});
      console.log(contact.domain + '+' + contact.address[0]);
    }
  });

})

app.post('/edit', function(req, res, next) {
  var formValues = {
    domain: req.body.domain,
    address: [req.body.address],
    smtp: {
      default: req.body.smtp_default,
      host: req.body.smtp_host,
      port: req.body.smtp_port,
      secure: req.body.smtp_secure,
      smtp_auth_user: req.body.smtp_auth_user,
      smtp_auth_pass: req.body.smtp_auth_pass
    }
  };

  console.log(req.body.domain + '=' + req.body.contact_id);
  var q = Contacts.where({ _id: req.body.contact_id });
  // this part needs expanding
  q.update({ $set: formValues }).update();
  q.update({ $set: formValues }).exec();

  res.redirect('/');
})

app.get('/delete', function(req, res) {
  var contactId = req.query.contact_id;
  console.log(contactId);

  var query = Contacts.where( { _id: contactId } );

  query.findOneAndDelete( function (err, contact) {
    if(err) {
      console.error(err)
    };
    console.log(contact.domain + " deleted.");
    res.redirect("/");
  });
})

app.listen(3000, () =>
  console.log('Initialization Complete: server listening on port 3000')
);
