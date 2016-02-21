// Facebook Auth Routes

// lib
var async = require('async');
var graph = require('fbgraph');
var express = require('express');
var config = require('config').facebook;

// init router
var router = module.exports = express.Router();

router.get('/', function(req, res) {

  // user denied access request?
  // guess we'll have to give up
  if(req.query.error) {
    // req.query.error == 'access_denied'
    res.json('access denied?');
    return;
  }

  // no code?
  // show facebook dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
      client_id: config.appid,
      redirect_uri: config.redirect_uri,
      scope: config.scope
    });
      res.redirect(authUrl);
    return;
  }

  // if we get here user has logged in through the fb dialogue
  // we should now see a code which we can used to exchange an access token

  async.waterfall([ authorize, extendToken ], onTokenComplete);

  function authorize(done) {
    graph.authorize({
      code: req.query.code,
      client_id: config.appid,
      client_secret: config.appsecret,
      redirect_uri: config.redirect_uri
    }, done);
  }

  function extendToken(fb, done) {
    var token = fb.access_token;
    graph.extendAccessToken({
      access_token: token,
      client_id: config.appid,
      client_secret: config.appsecret
    }, done);
  }

  function onTokenComplete(err, fb) {
    if(err) { return next(err); }
    // this is the extended (60 days) token
    // save to session for now
    // TODO: save to db instead
    req.session.facebook_token = fb.access_token;
    res.redirect('/facebook');
  }
});
