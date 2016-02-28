
// lib
var graph = require('fbgraph');
var express = require('express');

var config = require('config');
var model = require('lib/model');

// init
var router = express.Router();

// GET /
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

// GET /facebook
router.get('/facebook', function(req, res, next) {
  var token = req.session.facebook_token;
  if(!token) {
    res.redirect('/auth/facebook');
    return;
  }
  // just an abitrary graph api call
  // graph.get('/me/photos?fields=id,created_time,from,place,name,images,picture,tags,likes', { access_token: token }, function(err, fb) {
  graph.get('/me/photos?fields=id,created_time,from,place,name,images', { access_token: token }, function(err, fb) {
    if(err) { return next(err); }
    var photos = fb.data.map(photo => { return model.Photo.from('facebook', photo); });
    res.json(photos);
  });
});

// GET /instagram
router.get('/instagram', function(req, res, next) {
  var token = req.session.instagram_token;
  if(!token) {
    res.redirect('/auth/instagram');
    return;
  }
  // just an abitrary instagram api call

  instagram.recentByTag('snowy', function(err, result) {
    if(err) { return next(err); }
    var photos = result.data.map(media => { return model.Photo.from('instagram', media); });
    res.send(photos);
  });
});

// GET /logout
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.json({ status: 200, message: 'success' });
});

module.exports = router;
