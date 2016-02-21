// photo schema defn

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var PhotoSchema = module.exports = new Schema({

  // source of this photo
  source: { type: String, required: true, enum: [ 'facebook', 'instagram' ] },

  // the id of the photo from source
  id: { type: String, required: true },

  // photo created time reported by source
  created: { type: Date, required: true },

  // images in different resolutions of the photo
  images: [{
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, requird: true }
  }],

  // location of the photo
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    name: { type: String, required: true }
  },

  // caption
  caption: { type: String, required: true },

  // uploaded by this user
  by: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    picture: { type: String, required: true }
  }

});
