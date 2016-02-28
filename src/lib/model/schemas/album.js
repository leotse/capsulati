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
  }

}, { strict: true });

// index - url slug lookup
AlbumSchema.index({ slug: 1 }, { unique: true });
