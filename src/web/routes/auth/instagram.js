// Instagram Auth Routes

// lib
var async = require('async');
var express = require('express');
var instagram = require('instagram-node');
var config = require('config').instagram;

// init
var router = module.exports = express.Router();
var api = instagram.instagram();
api.use({
  client_id: config.clientid,
  client_secret: config.clientsecret
});

router.get('/', function(req, res) {
  var code = req.query.code;

  // no code? redirect to instagram auth dialog
  if(!code) {
    var authUrl = api.get_authorization_url(config.redirect, {
      scope: [ 'basic', 'public_content' ]
    });
    res.redirect(authUrl);
    return;
  }

  // if we get here user has signed in with instagram and sending us the access code
  // exchange code with user request token
  api.authorize_user(code, config.redirect, function(err, insta) {
    if(err) { return next(err); }
    req.session.instagram_token = insta.access_token;
    res.redirect('/instagram');
  });
});
