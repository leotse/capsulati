// simple instagram api wrapper
// we are using instagram-node for authentication
// great lib, but doesn't have support for old clients that are not limited by sandbox mode
// creating this wrapper to take advantage for better non sandboxed data for testing

// lib
var util = require('util');
var request = require('request');
var config = require('config').instagram;

// recent media by tag
module.exports.recentByTag = function(tag, callback) {
  var path = util.format('/tags/%s/media/recent', tag);
  var url = getUrl(path);
  var query = {
    client_id: config.clientid2,
    count: 50
  };
  request({
    url: url,
    qs: query,
    json: true,
  }, handleResponse(callback));
};

// helper - handles a http response
function handleResponse(callback) {
  return function(err, res, json) {
    if(err) { return callback(err); }
    if(res.statusCode !== 200) { return callback(json); }
    callback(null, json);
  };
}

// helper - gets instagram url for an endpoint
function getUrl(path) {
  return util.format('https://api.instagram.com/v1%s', path);
}
