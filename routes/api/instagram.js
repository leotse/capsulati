// Instagram API Routes

// lib
var _ = require('lodash');
var express = require('express');
var config = require('config').instagram;
var instagram = require('lib/api/instagram');

// init
var router = module.exports = express.Router();

// GET /api/instagram/tags/[tag-name]
router.get('/tags/:tag', function(req, res, next) {
  var tag = req.params.tag;
  instagram.recentByTag(tag, function(err, result) {
    if(err) { return next(err); }
    res.send(result);
  });
});
