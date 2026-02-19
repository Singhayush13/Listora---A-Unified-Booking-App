const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingType: {
    type: String,
    enum: ["HOTEL", "BUS"],
    required: true
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },

  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  seat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat" },

  fromDate: Date,
  toDate: Date,
  amountPaid: Number,

  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "REJECTED"],
    default: "PENDING"
  }
}, { timestamps: true });

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingType: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ fromDate: 1 });
bookingSchema.index({ toDate: 1 });


module.exports = mongoose.model("Booking", bookingSchema);