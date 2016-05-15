// adds an album to the db
// mostly for dev purposes

const moment = require('moment');
const config = require('config');
const model = require('lib/model');
const Album = model.Album;

model.connect(config.db.data);
const album = new Album({
  slug: 'snowy',
  tag: 'snowy',
  name: 'snowy',
  dates: {
    start: moment('2016-05-01', 'YYYY-MM-DD'),
    end: moment('2016-05-05-31', 'YYYY-MM-DD').endOf('day')
  }
});
album.save().then(saved => {
  console.log(saved);
  process.exit();
}).catch(err => console.log(err));
