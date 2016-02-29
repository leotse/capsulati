// simple instagram api wrapper
// we are using instagram-node for authentication
// great lib, but doesn't have support for old clients that are not limited by sandbox mode
// creating this wrapper to take advantage for better non sandboxed data for testing

// lib
var util = require('util');
var request = require('request-promise');
var config = require('config').instagram;

// recent media by tag
module.exports.recentByTag = function(tag) {
  var path = util.format('/tags/%s/media/recent', tag);
  var url = getUrl(path);
  var query = {
    client_id: config.clientid2,
    count: 50
  };
  return request({
    url: url,
    qs: query,
    json: true,
  });
};

// gets next page of data for ANY api calls, given the next_url
module.exports.next = function(url) {
  return request({
    url: url,
    json: true
  });
};

// helper - gets instagram url for an endpoint
function getUrl(path) {
  return util.format('https://api.instagram.com/v1%s', path);
}
