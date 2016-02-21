// photo schema defn

var _ = require('lodash');
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
  images: [ new Schema({
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, requird: true }
  }, { _id: false })],

  // uploaded by this user
  by: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    picture: { type: String, required: true }
  },

  // caption
  caption: { type: String },

  // location of the photo
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    name: { type: String, required: true }
  }

}, { strict: true });


// TODO: define indexes

// static - create a photo instance from instagram api media object
PhotoSchema.statics.fromInstagram = function(json) {
  var Photo = this.model('Photo');
  var photo = new Photo();
  photo.source = 'instagram';
  photo.id = json.id;
  photo.created = new Date(Number(json.created_time) * 1000);
  photo.images = _.map(json.images, (img, key) => {
    return {
      url: img.url,
      width: img.width,
      height: img.height
    };
  });

  // uploaded by
  photo.by = {
    id: json.user.id,
    name: json.user.full_name,
    picture: json.user.profile_picture
  };

  // optional caption
  if(json.caption) {
    photo.caption = json.caption.text;
  }

  // optional location
  if(json.location) {
    photo.location = {
      name: json.location.name,
      lat: json.location.latitude,
      lon: json.location.longitude
    };
  }

  return photo;
};

// static - create a photo instance from facebook graph api photo object
PhotoSchema.statics.fromFacebook = function(fbphoto) {
};
