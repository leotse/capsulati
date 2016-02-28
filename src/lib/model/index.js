// register capsulati data model

// lib
var mongoose = require('mongoose');
var log = require('lib/util/logger');

// init - register db models
var Photo = module.exports.Photo = mongoose.model('Photo', require('./schemas/photo'));
var Album = module.exports.Album = mongoose.model('Album', require('./schemas/album'));

// public - connect to db
module.exports.connect = function(uri, opts) {

  // connect to db
  mongoose.connect(uri, opts);

  // setup logging
  var conn = mongoose.connection;
  conn.on('connecting', logEvent('connecting'));
  conn.on('connected', logEvent('connected'));
  conn.on('open', logEvent('open'));
  conn.on('disconnecting', logEvent('disconnecting'));
  conn.on('disconnected', logEvent('disconnected'));
  conn.on('close', logEvent('close'));
  conn.on('reconnected', logEvent('reconnected'));
  conn.on('error', logEvent('error'));
  conn.on('fullsetup', logEvent('fullsetup'));

  return conn;
};

// helper - logs an event status
function logEvent(event) {
  return function() {
    log('[db]', event);
    if(arguments.length > 0) {
      console.log(arguments);
    }
  };
}
