// photos api endpoint

// libs
let express = require('express');
let model = require('lib/model');

let Album = model.Album;
let Photo = model.Photo;

// init
let router = module.exports = express.Router();

// GET /api/photos - returns latest photos
router.get('/', getLatest);

function getLatest(req, res, next) {
  let slug = req.query.slug;
  let limit = Number(req.query.limit) || 20;
  let skip = Number(req.query.skip) || 0;

  // optional since
  let since = 0;
  if(req.query.since) {
    since = new Date(Number(req.query.since)).valueOf();
  }

  if(!slug) { return next(new Error('slug required')); }

  Album.findOne().where('slug', slug).then(album => {
    Photo.find()
      .where('_album', album)
      .where('created').gt(since)
      .sort('-created')
      .limit(limit)
      .skip(skip)
      .exec((err, photos) => {
        if(err) { return next(err); }
        res.json(photos);
      });
  }).catch(next);
}
