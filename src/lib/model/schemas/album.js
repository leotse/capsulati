// album schema

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var AlbumSchema = module.exports = new Schema({

  // url slug
  slug: { type: String, required: true },

  // hashtag to look for
  tag: { type: String, required: true },

  // name of the album
  name: { type: String, default: null },

  // start/end date
  dates: {
    start: { type: Date, default: null },
    end: { type: Date, default: null }
  },

  // api tokens
  tokens: {
    facebook: { type: String, default: null },
    instagram: { type: String, default: null }
  },

  // info about the last update so we know where we left off
  lastUpdate: {
    date: { type: Date, default: null },

    // use this as min_tag_id to get photo since last call
    instagramId: { type: String, default: null },
    facebookId: { type: String, default: null }
  }


}, { strict: true });

// index - url slug lookup
AlbumSchema.index({ slug: 1 }, { unique: true });

// statics - get all active albums at the given date
AlbumSchema.statics.getActive = function(date) {
  if(!date) { throw new Error('invalid date'); }
  return this.model('album').find({
    $or: [
      { 'dates.start': null, 'dates.end': null },
      { 'dates.start': { $lte: date }, 'dates.end': { $gte: date } }
    ]
  });
};
