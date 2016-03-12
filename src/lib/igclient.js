// a wrapper on top of the api
// contains helper that requires state to function properly
// ex handing paging, etc

var request =  require('request-promise');
var api = require('lib/api/instagram');

var IGClient = module.exports = class {
  recentByTagUntilId(tag, minId, onPhotos) {
    return new Promise((resolve, reject) => {
      var all = [];

      // first... check latest
      api.recentByTag(tag, { count: 5, minId: minId })
        .then(getMore)
        .catch(reject);

      // check to see if we need more
      function getMore(res) {
        var maxId = res.pagination.next_max_id;
        var photos = res.data;

        // allow caller to process this page of result
        all = all.concat(photos);
        onPhotos(photos);

        // get more?
        if(!maxId) { resolve(all); }
        else {
          api.recentByTag(tag, { count: 5, minId: minId, maxId: maxId })
            .then(getMore)
            .catch(reject);
        }
      }
    });
  }
};

// dev code
var client = new IGClient();
client.recentByTagUntilId('helloworld', '1204576142599235518', photos => {
  console.log('=== onphotos ===');
  printIds(photos);
})
.then(photos => { console.log('=== done ==='); printIds(photos); })
.catch(err => console.log(err));


function printIds(photos) {
  photos.forEach(p => {
    console.log(p.id);
  });
}
