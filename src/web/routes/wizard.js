// setup wizard routes
// includes wizard steps + facebook auth + instagram auth

// lib
var express = require('express');
var moment = require('moment-timezone');

var model = require('lib/model');
var Album = model.Album;

// init router
var router = module.exports = express.Router();

// GET /wizard - wizard root, just redirect to step 1
router.get('/', function(req, res) {
  res.redirect('/wizard/1');
});

// GET /wizard/1 - wizard step 1
router.get('/1', function(req, res) {
  res.render('wizard/1');
});

// POST /wizard/1 - reserve url slug, then continue to step 2
router.post('/1', function(req, res, next) {
  var body = req.body;
  var slug = body.slug.toLowerCase();
  var tag = body.tag.toLowerCase();
  var timezone = body.timezone;
  var startDate = moment.tz(body.startDate, 'YYYY-MM-DD', timezone);
  var endDate = moment.tz(body.endDate, 'YYYY-MM-DD', timezone).endOf('day');

  // save album to db to 'reserve' slug
  var album = new Album({
    slug: slug,
    tag: tag,
    dates: {
      start: startDate,
      end: endDate
    }
  });

  album.save().then(function(saved) {
    req.session.album = saved.toObject();
    res.redirect('/auth/facebook');
  })
  .catch(next);
});

// GET /wizard/2
router.get('/2', function(req, res) {
  res.render('wizard/2');
});

// POST /wizard/2
router.post('/2', function(req, res) {
  res.redirect('/auth/instagram');
});

// GET /wizard/3
router.get('/3', function(req, res) {
  res.render('wizard/3', {
    json: JSON.stringify(req.session.album)
  });
});
