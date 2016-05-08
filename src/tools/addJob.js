// adds a job to queue
// mostly for dev purposes

var jobs = require('lib/util/jobs');
var model = require('lib/model');
var config = require('config');
var Album = model.Album;

model.connect(config.db.data);
jobs.createIG('56e4911d8917cd152e850a2e', 'helloworld', new Date('2016-05-08 18:45'))
  .then(job => {
    console.log(job.data);
    process.exit();
  }).catch(err => console.log(err));
