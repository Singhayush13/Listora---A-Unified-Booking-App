const router = require("express").Router();
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

/* ======================================
   GET ROOMS BY HOTEL ID (PUBLIC)
====================================== */
router.get("/:hotelId", async (req, res) => {
  try {
    const rooms = await Room.find({ hotel: req.params.hotelId });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
});

/* ======================================
   INIT ROOMS FOR EXISTING HOTEL (TEMP)
====================================== */
router.post("/init/:hotelId", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // delete old rooms if any
    await Room.deleteMany({ hotel: hotel._id });

    const rooms = [];
    for (let i = 1; i <= hotel.rooms; i++) {
      rooms.push({
        hotel: hotel._id,
        roomNumber: `Room-${i}`,
        status: "AVAILABLE"
      });
    }

    await Room.insertMany(rooms);

    res.json({
      message: "Rooms initialized successfully",
      count: rooms.length
    });
  } catch (err) {
    console.error("ROOM INIT ERROR:", err);
    res.status(500).json({ message: "Room init failed" });
  }
});

module.exports = router;
