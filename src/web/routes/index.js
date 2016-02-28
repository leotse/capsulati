// general routes mounted on root

// lib
var graph = require('fbgraph');
var express = require('express');

var config = require('config');
var model = require('lib/model');
var Photo = model.Photo;
var Album = model.Album;

// init
var router = express.Router();

// GET /
router.get('/', function(req, res) {
  res.render('index');
});

// GET /logout
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

// GET /wizard - wizard root, just redirect to step 1
router.get('/wizard', function(req, res) {
  res.redirect('/wizard/1');
});

// GET /wizard/1 - wizard step 1
router.get('/wizard/1', function(req, res) {
  res.render('wizard/1');
});

// POST /wizard/1 - reserve url slug, then continue to step 2
router.post('/wizard/1', function(req, res, next) {
  var slug = req.body.slug.toLowerCase();
  var tag = req.body.tag.toLowerCase();

  // save album to db to 'reserve' slug
  var album = new Album({
    slug: slug,
    tag: tag
  });
  album.save().then(function(saved) {
    req.session.album = saved.toObject();
    res.redirect('/auth/facebook');
  })
  .catch(next);
});

// GET /wizard/2
router.get('/wizard/2', function(req, res) {
  res.render('wizard/2');
});

// POST /wizard/2
router.post('/wizard/2', function(req, res) {
  res.redirect('/auth/instagram');
});

// GET /wizard/3
router.get('/wizard/3', function(req, res) {
  res.render('wizard/3', {
    json: JSON.stringify(req.session.album)
  });
});


// // GET /facebook
// router.get('/facebook', function(req, res, next) {
//   var token = req.session.facebook_token;
//   if(!token) {
//     res.redirect('/auth/facebook');
//     return;
//   }
//   // just an abitrary graph api call
//   // graph.get('/me/photos?fields=id,created_time,from,place,name,images,picture,tags,likes', { access_token: token }, function(err, fb) {
//   graph.get('/me/photos?fields=id,created_time,from,place,name,images', { access_token: token }, function(err, fb) {
//     if(err) { return next(err); }
//     var photos = fb.data.map(photo => { return model.Photo.from('facebook', photo); });
//     res.json(photos);
//   });
// });
//
// // GET /instagram
// router.get('/instagram', function(req, res, next) {
//   var token = req.session.instagram_token;
//   if(!token) {
//     res.redirect('/auth/instagram');
//     return;
//   }
//
//   // latest photos
//   Photo.find().limit(10).sort('-created').exec((err, photos) => {
//     if(err) { return next(err); }
//     res.send(photos);
//   });
//
//   // just an abitrary instagram api call
//   // instagram.recentByTag('snowy', function(err, result) {
//   //   if(err) { return next(err); }
//   //   var photos = result.data.map(media => { return model.Photo.from('instagram', media); });
//   //   res.send(photos);
//   // });
// });

module.exports = router;
