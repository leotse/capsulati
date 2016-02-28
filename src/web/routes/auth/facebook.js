// Facebook Auth Routes

// lib
var graph = require('fbgraph');
var express = require('express');
var config = require('config').facebook;

var model = require('lib/model');

module.exports = function(successRedirectUrl) {
  var router = express.Router();

  router.get('/', function(req, res, next) {

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

    // async.waterfall([ authorize, extendToken ], onTokenComplete);
    authorize()
      .then(extendToken)
      .then(updateAlbum)
      .then(redirectUser)
      .catch(next);

    function authorize(done) {
      return new Promise((resolve, reject) => {
        graph.authorize({
          code: req.query.code,
          client_id: config.appid,
          client_secret: config.appsecret,
          redirect_uri: config.redirect_uri
        }, function(err, fb) {
          if(err) { return reject(err); }
          resolve(fb);
        });
      });
    }

    function extendToken(fb) {
      return new Promise((resolve, reject) => {
        graph.extendAccessToken({
          access_token: fb.access_token,
          client_id: config.appid,
          client_secret: config.appsecret
        }, function(err, fb) {
          if(err) { return reject(err); }
          resolve(fb);
        });
      });
    }

    function updateAlbum(fb) {

      // we now have the extended (60 days) token
      // update token in album
      var albumID = req.session.album._id;
      return model.Album.findById(albumID).then(function(album) {
        album.tokens.facebook = fb.access_token;
        return album.save();
      });
    }

    function redirectUser(album) {
      req.session.album = album.toObject();
      res.redirect(successRedirectUrl);
    }
  });

  return router;
};
