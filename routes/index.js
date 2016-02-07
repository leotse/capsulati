
// lib
var graph = require('fbgraph');
var express = require('express');

// init
var router = express.Router();

// GET /
router.get('/', function(req, res, next) {
  var token = req.session.token;
  if(!token) {
    res.redirect('/auth/facebook');
    return;
  }
  graph.get('/me/photos?fields=created_time,from,place,name,picture,tags,likes', { access_token: token }, function(err, fb) {
    if(err) { return next(err); }
    res.json(fb);
  });
});

// GET /logout
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.json({ status: 200, message: 'success' });
});

module.exports = router;
