// a worker that pulls instagram for the given tag and max id

// libs
var _ = require('lodash');
var async = require('async');
var moment = require('moment');

var config = require('config');
var model = require('lib/model');
var log = require('lib/util/logger');
var instagram = require('lib/api/instagram');

var Photo = model.Photo;

// init - connect to db
model.connect(config.db.data);

// dat worker
var work = module.exports = function(opts, callback) {
  var tag = opts.tag;
  var minDate = opts.minDate;

  if(!_.isString(tag)) { throw new Error('invalid tag'); }
  if(!_.isDate(minDate)) { throw new Error('invalid minDate'); }

  log('instagram worker started for #%s until %s', tag, minDate);

  // get latest photo
  instagram.recentByTag(tag, onAPIComplete);
  function onAPIComplete(err, res) {

    // parse the instagram api response
    var nextUrl = res.pagination.next_url;
    var photos = _.map(res.data, json => {
      return Photo.from('instagram', json);
    });
    var first = _.first(photos);
    var last = _.last(photos);

    log('retreived %d photos for #%s',
      photos.length,
      tag,
      first.created.toISOString(),
      last.created.toISOString()
    );

    // update db
    async.eachSeries(photos, function(photo, done) {
      var doc = photo.toObject();
      delete doc._id;
      Photo.update(
        { source: 'instagram', id: doc.id },
        doc,
        { safe: true, upsert: true, overwrite: true },
        done
      );
    }, onPhotosUpdated);

    // and see if we need to get more
    if(last.created > minDate) {
      setImmediate(function() {
        instagram.next(nextUrl, onAPIComplete);
      });
    } else {
      setImmediate(callback);
    }
  }
};

// helper - db update callback, mostly for logging purposes
function onPhotosUpdated(photo) {
  return function(err) {
    if(err) {
      log('db update erorr');
      console.log(err);
    }
  };
}

var minDate = moment().startOf('minute').add(-30, 'minutes').toDate();
work({ tag:'snowboarding', minDate: minDate }, function() {
  log('done!');
});
