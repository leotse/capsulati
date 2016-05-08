// adds a job to queue
// mostly for dev purposes

var jobs = require('lib/util/jobs');
var model = require('lib/model');
var config = require('config');
var Album = model.Album;

model.connect(config.db.data);
Album.findById('56db598ae8b371e20fd3653d')
  .then(album => jobs.createIG(album))
  .then(job => {
    console.log(job.data);
    process.exit();
  })
  .catch(err => console.log(err));
