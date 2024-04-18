const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {type: String, required: true},
  city: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cities', default: [] }],
  landmark: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Landmarks', default: [] }],
  activity: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activities', default: [] }],
  restaurant: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurants', default: [] }],
  hotel: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotels', default: [] }],
  guide: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Guides', default: [] }]
});

const Wishlists = mongoose.model('Wishlists', wishlistSchema);

module.exports = Wishlists;
 