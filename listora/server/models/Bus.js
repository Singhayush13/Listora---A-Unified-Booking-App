const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    busName: {
      type: String,
      required: true
    },

    departure: {
      type: String,
      required: true
    },

    destination: {
      type: String,
      required: true
    },

    ac: {
      type: Boolean,
      default: false
    },

    suspension: {
      type: String,
      enum: ["Air", "Hydraulic", "Normal"],
      required: true
    },

    totalSeats: {
      type: Number,
      min: 30,
      max: 44,
      required: true
    },

    pricePerSeat: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

/* ===============================
   🔹 VIRTUAL SEATS RELATION
================================ */
busSchema.virtual("seats", {
  ref: "Seat",
  localField: "_id",
  foreignField: "bus"
});

/* 🔹 REQUIRED FOR populate() */
busSchema.set("toJSON", { virtuals: true });
busSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Bus", busSchema);
