const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true
    },

    seatNumber: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "PENDING", "BOOKED"],
      default: "AVAILABLE"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seat", seatSchema);
