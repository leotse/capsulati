// adds a job to queue
// mostly for dev purposes

const moment = require('moment');
const config = require('config');
const model = require('lib/model');
const jobs = require('lib/util/jobs');

const Album = model.Album;

model.connect(config.db.data);

// createIG params are (albumId, #tag, until)
jobs.createIG('5738bc2a74ba49331dd5a59a', 'snowy', moment().add(-30, 'minute').toDate())
  .then(job => {
    console.log(job.data);
    process.exit();
  })
  .catch(err => console.log(err));
