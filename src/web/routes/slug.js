// custom slug routes
// this router looks up the slug in the db and returns the corresponding album
// this router should be mounted just before the error handlers

var express = require('express');
var router = module.exports = express.Router();

var model = require('lib/model');

router.get('/:slug', function(req, res, next) {
  var slug = req.params.slug;
  model.Album.findOne()
    .where('slug', slug)
    .then(album => {
      console.log('wer', album);
      if(!album) { return next(new Error('not found')); }
      res.json(album);
    }).catch(next);
});
