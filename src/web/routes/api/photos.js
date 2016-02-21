// photos api endpoint

// libs
var express = require('express');
var model = require('lib/model');
var Photo = model.Photo;

// init
var router = module.exports = express.Router();

// GET /api/photos - returns latest photos
router.get('/', getLatest);

function getLatest(req, res, next) {
  var limit = Number(req.query.limit) || 20;
  var skip = Number(req.query.skip) || 0;
  Photo.find()
    .sort('-created')
    .limit(limit)
    .skip(skip)
    .exec((err, photos) => {
      if(err) { return next(err); }
      res.send(photos);
    });
}
