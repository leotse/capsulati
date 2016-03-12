// a wrapper on top of the instagram api
// contains helper that requires states to function properly
// ex recent until id/date, etc

var moment = require('moment');
var request =  require('request-promise');
var api = require('lib/api/instagram');

var IGClient = module.exports = class {

  recentByTagUntil(tag, opts) {
    return new Promise((resolve, reject) => {

      var id = opts.id;
      var date = opts.date;
      var onPhotos = opts.onPhotos;
      var all = [];

      // first... check latest
      api.recentByTag(tag, { count: 5, minId: id })
        .then(getMore).catch(reject);

      // check to see if we need more
      function getMore(res) {
        var maxId = res.pagination.next_max_id;
        var photos = res.data;
        var last = photos[photos.length - 1];
        var oldest = moment.unix(last.created_time).toDate();

        // allow caller to process this page of result
        all = all.concat(photos);
        onPhotos(photos);

        // get more?
        if(!maxId) { return resolve(all); }
        if(date && oldest < date) { return resolve(all); }

        api.recentByTag(tag, { count: 5, minId: id, maxId: maxId })
          .then(getMore)
          .catch(reject);
      }
    });
  }
};

// // dev code
// var client = new IGClient();
// client.recentByTagUntil('helloworld', {
//   // id: '1204576142599235518',
//   date: moment('2016-03-12 16:00').toDate(),
//   onPhotos: photos => {
//     console.log('=== onphotos ===');
//     printIds(photos);
//   }
// })
// .then(photos => { console.log('=== done ==='); printIds(photos); })
// .catch(err => console.log(err));
//
//
// function printIds(photos) {
//   photos.forEach(p => {
//     console.log(p.id, moment.unix(p.created_time).format());
//   });
// }
