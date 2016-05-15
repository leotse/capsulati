// work scheduler
// periodically goes through all active albums and kick off refresh ops
// TBD: should we do a proper implementation with job queues?

// libs
const moment = require('moment');
const CronJob = require('cron').CronJob;

const config = require('config');
const model = require('lib/model');
const jobs = require('lib/util/jobs');
const log = require('lib/util/logger');


// init
model.connect(config.db.data);
const scheduler = new CronJob(
  config.scheduler,
  onTick,
  onStop,
  true,
  'America/Toronto'
);

function onTick() {
  const now = moment().add(-1, 'minute').toDate();
  model.Album.getActive(now)
    .then(scheduleJobs)
    .catch(onError);
}

function scheduleJobs(albums) {
  albums.forEach(album => {
    const date = album.lastUpdate.instagram.date || moment().add(-1, 'hour').toDate();
    jobs.createIG(album._id, album.tag, date).then(() => {
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
