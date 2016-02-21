// register capsulati data model

// lib
var mongoose = require('mongoose');
var log = require('lib/util/logger');

// init - register db models
var Photo = module.exports.Photo = mongoose.model('Photo', require('./photo'));

// public - connect to db
module.exports.connect = function(uri, opts, callback) {

  // connect to db
  mongoose.connect(uri, opts, callback);

  // setup logging
  var conn = mongoose.connection;
  conn.on('connecting', logFn('connecting'));
  conn.on('connected', logFn('connected'));
  conn.on('open', logFn('open'));
  conn.on('disconnecting', logFn('disconnecting'));
  conn.on('disconnected', logFn('disconnected'));
  conn.on('close', logFn('close'));
  conn.on('reconnected', logFn('reconnected'));
  conn.on('error', logFn('error'));
  conn.on('fullsetup', logFn('fullsetup'));

  return conn;
};

// helper - logs an event status
function logFn(event) {
  return function() {
    log('[db]', event);
    if(arguments.length > 0) {
      console.log(arguments);
    }
  };
}
