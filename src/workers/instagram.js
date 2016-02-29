// a worker that pulls instagram for the given tag and max id

// libs
var _ = require('lodash');
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

var minDate = moment().startOf('minute').add(-30, 'minutes').toDate();
work({ tag:'natgeo', minDate: minDate }).then(()=>{
  log('done!');
  process.exit();
});
