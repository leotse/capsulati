// a worker that pulls instagram for the given tag and max id

// libs
var _ = require('lodash');
var moment = require('moment');

var config = require('config');
var model = require('lib/model');
var log = require('lib/util/logger');
var IGClient = require('lib/igclient');

var Album = model.Album;
var Photo = model.Photo;

module.exports = function(job, done) {
  var album = job.data;
  var tag = album.tag;

  log('instagram worker #%s min_tag_id %s start %s end %s',
    album.tag,
    album.lastUpdate.instagram.id,
    album.dates.start,
    album.dates.end
  );

  // check latest photos for the tag
  var minTagId = album.lastUpdate.instagram.id;
  var client = new IGClient();

  // get photos since last update
  var apiPromise = client.recentByTagUntil(tag, {
    id: minTagId,
    date: new Date(album.dates.start),
    onPhotos: onPhotos
  });

  // update db once photos are ready
  Promise.all([ apiPromise.then(updatePhotos), apiPromise.then(updateAlbum) ])
    .then(() => {
      log('#%s complete!', album.tag);
      done();
    })
    .catch(err => {
      log('error', err);
      console.log(err.stack);
      done(err);
    });

  // called when we page api calls, just for logging for now
  function onPhotos(photos) {
    log('downloaded %d photos', photos.length,
      moment.unix(photos[photos.length - 1].created_time).format());
  }

  // update photos in db
  function updatePhotos(photos) {
    log('updating %d photos', photos.length);
    var updates = photos.map(json => Photo.from('instagram', json) )
    .map(photo => {
      photo._album = album._id;
      var doc = photo.toObject();
      delete doc._id;
      return Photo.update(
        { _album: album._id, source: 'instagram', id: doc.id },
        doc,
        { safe: true, upsert: true, overwrite: true }
      );
    });
    return Promise.all(updates);
  }

  // update album 'bookmark'
  function updateAlbum(photos) {
    log('updating album');

    // no update? just continue
    if(photos.length === 0) {
      return Promise.resolve(true);
    }

    var latest = photos[0];
    var id = latest.id.split('_')[0];
    return Album.findById(album._id).then(album => {
      album.lastUpdate.instagram.id = id;
      album.lastUpdate.instagram.date = new Date();
      return album.save();
    });
  }
};
