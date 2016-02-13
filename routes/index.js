
// lib
var graph = require('fbgraph');
var express = require('express');
var instgram = require('instagram-node');
var config = require('config');

// init
var router = express.Router();
var igapi = instgram.instagram();
igapi.use({
  client_id: config.instagram.clientid2,
  client_secret: config.instagram.clientsecret2
});

// GET /
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('index', { title: 'login' });
});

// GET /facebok
router.get('/facebook', function(req, res, next) {
  var token = req.session.facebook_token;
  if(!token) {
    res.redirect('/auth/facebook');
    return;
  }
  graph.get('/me/photos?fields=created_time,from,place,name,picture,tags,likes', { access_token: token }, function(err, fb) {
    if(err) { return next(err); }
    res.json(fb);
  });
});

// GET /instagram
router.get('/instagram', function(req, res, next) {
  var token = req.session.instagram_token;
  if(!token) {
    res.redirect('/auth/instagram');
    return;
  }
  igapi.tag_media_recent('selfie', {client_id: config.instagram.clientid2}, function(err, result, remaining, limit) {
    if(err) { return next(err); }
    res.send(result);
  });
});

// GET /logout
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.json({ status: 200, message: 'success' });
});

module.exports = router;
