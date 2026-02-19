const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
hotel: { type: mongoose.Schema.Types.ObjectId, ref:'Hotel' },
rating: Number,
comment: String,
images: [String]
},{ timestamps:true });


module.exports = mongoose.model('Review', reviewSchema);