// work scheduler
// periodically goes through all active albums and kick off refresh ops
// TBD: should we do a proper implementation with job queues?

// libs
var moment = require('moment');
var CronJob = require('cron').CronJob;

var config = require('config');
var model = require('lib/model');
var jobs = require('lib/util/jobs');
var log = require('lib/util/logger');


// init
model.connect(config.db.data);
var scheduler = new CronJob(
  config.scheduler,
  onTick,
  onStop,
  true,
  'America/Toronto'
);

function onTick() {
  var date = moment('2016-03-06', 'YYYY-MM-DD').toDate();
  model.Album.getActive(date)
    .then(scheduleJobs)
    .catch(onError);
}

function scheduleJobs(albums) {
  albums.forEach(album => {
    jobs.createIG(album.toObject()).then(() => {
      log('IG job created for #%s', album.slug);
    });
  });
}

function onError(err) {
  log('scheduler error', err);
  console.log(err.stack);
  scheduler.stop();
}

function onStop() {
  log('cron stopped');
  process.exit();
}
