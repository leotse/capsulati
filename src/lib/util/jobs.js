// job queue wrapper

// libs
var kue = require('kue');
var config = require('config');
var log = require('lib/util/logger');

// init
var queue = kue.createQueue(config.kue);

// public - create instagram job
module.exports.createIG = function(album) {
  return create('instagram', album);
};

// public - register instagram jobs worker
module.exports.registerIG = function(fn) {
  return register('instagram', fn);
};

// public - create facebook worker job
module.exports.createFB = function(album) {
  return create('facebook', album);
};

// public - register facebook jobs worker
module.exports.registerFB = function(fn) {
  return register('facebook', fn);
};


// helper - create a job for the given job type
function create(type, payload) {
  return new Promise((resolve, reject) => {
    var job = queue.create(type, payload)
      .attempts(5)
      .backoff(true);
    job.save(err => {
      if(err) { reject(err); }
      else { resolve(job); }
    });
  });
}

// helper - register a worker for the given job type
function register(type, fn) {
  return queue.process(type, fn);
}
