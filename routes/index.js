
// lib
var graph = require('fbgraph');
var express = require('express');
var instgram = require('instagram-node');

// init
var router = express.Router();

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
  var api = instgram.instagram();
  api.use({ access_token: token });
  api.user_self_feed(function(err, medias) {
    if(err) { return next(err); }
    res.send(medias);
  });
});

// GET /logout
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.json({ status: 200, message: 'success' });
});

module.exports = router;
