const mongoose = require('mongoose');


const hotelSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: String,
  phone: String,
  pricePerNight: { type: Number, required: true },
  amenities: { type: [String], default: [] },
  foodAvailable: { type: Boolean, default: false },
  foodTypes: { type: [String], default: [] },
  images: { type: [String], default: [] },
  rooms: Number,
  rating: { type: Number, default: 0 }
}, { timestamps: true });



module.exports = mongoose.model('Hotel', hotelSchema);