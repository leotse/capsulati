// a worker that pulls instagram for the given tag and max id

// libs
var _ = require('lodash');
var moment = require('moment');

var config = require('config');
var model = require('lib/model');
var log = require('lib/util/logger');
var instagram = require('lib/api/instagram');

var Photo = model.Photo;

module.exports = function(job, done) {
  var album = job.data;
  var tag = album.tag;

  log('instagram work', album.tag, album.dates, album.lastUpdate);

  // check latest photos for the tag
  var minTagId = album.lastUpdate.instagramId;
  getAll()
    .then(saveAll)
    .then(updateAlbum)
    .then(done).catch(done);

  // get all photos for tag until the album start date
  //   OR where last update left off
  function getAll() {
    instagram.recentByTag(tag, minTagId)
  }

  function processLatest(res) {

    // no photos? job is done!
    if(res.data.length === 0) {
      return done();
    }

    var photos = res.data.map(json => Photo.from('instagram', json));
    var first = photos[0];
    var last = photos[photos.length - 1];
    console.log(first);
    console.log(last);
  }
};

// dat worker
var work = function(opts, callback) {
  return new Promise((resolve, reject) => {

    var tag = opts.tag;
    var minDate = opts.minDate;

    if(!_.isString(tag)) { throw new Error('invalid tag'); }
    if(!_.isDate(minDate)) { throw new Error('invalid minDate'); }

    log('instagram worker started for #%s until %s', tag, minDate);

    // get latest photo until we reach minDate

    instagram.recentByTag(tag)
      .then(processAPIResponse)
      .catch(reject);

    function processAPIResponse(res) {
      updateDB(res).then(()=>{
        var nextUrl = res.pagination.next_url;
        var photos = res.data.map(json => {
          return Photo.from('instagram', json);
        });
        var first = _.first(photos);
        var last = _.last(photos);

        log('retreived %d photos for #%s %s to %s',
          photos.length, tag,
          first ? first.created.toISOString() : '-',
          last ? last.created.toISOString() : '-'
        );

        if(nextUrl && last.created > minDate) {
          setImmediate(() => {
            instagram.next(nextUrl)
              .then(processAPIResponse)
              .catch(reject);
          });
        } else {
          resolve();
        }
      }).catch(reject);
    }

    function updateDB(res) {
      var updates = res.data.map(json => {
        return Photo.from('instagram', json);
      }).map(photo => {
        var doc = photo.toObject();
        delete doc._id;
        return Photo.update(
          { source: 'instagram', id: doc.id },
          doc,
          { safe: true, upsert: true, overwrite: true }
        );
      });
      return Promise.all(updates);
    }
  });
};
