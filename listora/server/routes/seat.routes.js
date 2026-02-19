const router = require("express").Router();
const Seat = require("../models/Seat");

/* =====================================
   GET SEATS BY BUS ID
===================================== */
router.get("/bus/:busId", async (req, res) => {
  try {
    const seats = await Seat.find({ bus: req.params.busId });

    // 🔥 FIX: numeric sort (S1, S2, S3...)
    seats.sort((a, b) => {
      const numA = parseInt(a.seatNumber.replace("S", ""));
      const numB = parseInt(b.seatNumber.replace("S", ""));
      return numA - numB;
    });

    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch seats" });
  }
});


module.exports = router;
