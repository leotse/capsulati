// adds a job to queue
// mostly for dev purposes

var jobs = require('lib/util/jobs');
var model = require('lib/model');
var config = require('config');
var Album = model.Album;

model.connect(config.db.data);
Album.findById('56e4911d8917cd152e850a2e')
  .then(album => jobs.createIG(album))
  .then(job => {
    console.log(job.data);
    process.exit();
  })
  .catch(err => console.log(err));
