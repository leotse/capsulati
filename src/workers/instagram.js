// a worker that pulls instagram for the given tag and max id

// libs
const moment = require('moment');

const config = require('config');
const model = require('lib/model');
const log = require('lib/util/logger');
const instagram = require('lib/api/instagram');

const Album = model.Album;
const Photo = model.Photo;

module.exports = function (job, done) {
  const album = job.data;
  const tag = album.tag;
  const start = new Date(album.dates.start);
  const end = new Date(album.dates.end);
  const lastUpdated = new Date(album.lastUpdate.instagram.date);


  log(`instagram worker #${tag} :: lastupdated ${lastUpdated}`);

  // check latest photos for the tag
  const req = instagram.recentByTagUntil(
    tag, lastUpdated, { count: 50, apiKey: config.instagram.clientid2 });

  // update db once photos are ready
  Promise.all([ req.then(updatePhotos), req.then(updateAlbum) ])
    .then(() => {
      log(`${tag} complete!`);
      done();
    })
    .catch(err => {
      log('instgram worker error:');
      console.log(err);
      console.log(err.stack);
      done(err);
    });

  // update photos in db
  function updatePhotos(photos) {
    log('updating %d photos', photos.length);
    const updates = photos.map(json => Photo.from('instagram', json) )
    .map(photo => {
      photo._album = album._id;
      const doc = photo.toObject();
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

    const latest = photos[0];
    const id = latest.id.split('_')[0];
    return Album.findById(album._id).then(album => {
      album.lastUpdate.instagram.id = id;
      album.lastUpdate.instagram.date = new Date();
      return album.save();
    });
  }
};
