// job worker
// listens for instagram and facebook album update jobs
// and spawn processes to do the work accordingly

// libs
var config = require('config');
var model = require('lib/model');
var jobs = require('lib/util/jobs');
var log = require('lib/util/logger');

// init - connect to db
model.connect(config.db.data);

log('starting worker...');
jobs.registerIG(require('./instagram'));
// jobs.registerFB(require('./facebook'));
// var minDate = moment().startOf('minute').add(-30, 'minutes').toDate();
// work({ tag:'natgeo', minDate: minDate }).then(()=>{
//   log('done!');
//   process.exit();
// });
