// custom slug routes
// this router looks up the slug in the db and returns the corresponding album
// this router should be mounted just before the error handlers

const express = require('express');
const model = require('lib/model');
const router = module.exports = express.Router();

// GET /:slug
router.get('/:slug', function(req, res, next) {
  const slug = req.params.slug;
  model.Album.findOne()
    .where('slug', slug)
    .then(album => {
      if(!album) { return next(new Error('not found')); }
      const title = '#' + album.tag;
      res.render('album', { title, album });
    }).catch(next);
});
