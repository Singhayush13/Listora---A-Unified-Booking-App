const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },
    roomNumber: {
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

module.exports = mongoose.model("Room", roomSchema);
