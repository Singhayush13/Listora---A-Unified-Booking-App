const router = require("express").Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Bus = require("../models/Bus");
const Room = require("../models/Room");
const Seat = require("../models/Seat");
const auth = require("../middleware/auth");
const role = require("../middleware/role");


/* ======================================
   GET PROVIDER DASHBOARD ANALYTICS
====================================== */

router.get("/stats", auth, role(["PROVIDER"]), async (req, res) => {
  try {
    // Ensure we are using a proper MongoDB ObjectId
    const providerId = new mongoose.Types.ObjectId(req.user.id);

    const [bookingStats, hotelCount, busCount] = await Promise.all([
      Booking.aggregate([
        { $match: { provider: providerId } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            pendingCount: { 
              $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] } 
            },
            confirmedCount: { 
              $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, 1, 0] } 
            },
            totalRevenue: { 
              $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, "$amountPaid", 0] } 
            }
          }
        }
      ]),
      Hotel.countDocuments({ provider: req.user.id }),
      Bus.countDocuments({ provider: req.user.id })
    ]);

    // Format the response safely
    const stats = bookingStats.length > 0 ? bookingStats[0] : { 
      totalBookings: 0, 
      pendingCount: 0, 
      confirmedCount: 0, 
      totalRevenue: 0 
    };

    res.json({
      totalBookings: stats.totalBookings,
      pendingCount: stats.pendingCount,
      confirmedCount: stats.confirmedCount,
      totalRevenue: stats.totalRevenue,
      hotelCount,
      busCount
    });

  } catch (err) {
    // This will print the EXACT error in your Terminal/Command Prompt
    console.error("DETAILED STATS ERROR:", err); 
    res.status(500).json({ message: "Analytics fetch failed", error: err.message });
  }
});

/* ======================================
   GET PROVIDER BOOKING REQUESTS
====================================== */
router.get(
  "/bookings",
  auth,
  role(["PROVIDER"]),
  async (req, res) => {
    try {
      const bookings = await Booking.find({
        provider: req.user.id,
        status: "PENDING"
      })
        .populate("user", "name email")
        .populate("hotel", "name")
        .populate("room", "roomNumber status")
        .populate("bus", "busName")              
        .populate("seat", "seatNumber status")
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (err) {
      console.error("PROVIDER BOOKINGS ERROR:", err);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  }
);

// provider.routes.js
router.get(
  "/buses",
  auth,
  role(["PROVIDER"]),
  async (req, res) => {
    try {
      const buses = await Bus.find({ provider: req.user.id })
        .populate("seats"); // optional

      res.json(buses);
    } catch (err) {
      console.error("PROVIDER BUSES ERROR:", err);
      res.status(500).json({ message: "Failed to fetch buses" });
    }
  }
);


/* ======================================
   ACCEPT BOOKING
====================================== */
router.post(
  "/bookings/:id/accept",
  auth,
  role(["PROVIDER"]),
  async (req, res) => {
    try {
      const booking = await Booking.findOne({
        _id: req.params.id,
        provider: req.user.id,
        status: "PENDING"
      });

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      booking.status = "CONFIRMED";
      await booking.save();

      // 🔹 HOTEL LOGIC
      if (booking.bookingType === "HOTEL") {
        await Room.findByIdAndUpdate(booking.room, {
          status: "BOOKED"
        });
      }

      // 🔹 BUS LOGIC
      if (booking.bookingType === "BUS") {
        await Seat.findByIdAndUpdate(booking.seat, {
          status: "BOOKED"
        });
      }

      res.json({ message: "Booking accepted successfully" });
    } catch (err) {
      console.error("ACCEPT BOOKING ERROR:", err);
      res.status(500).json({ message: "Failed to accept booking" });
    }
  }
);



/* ======================================
   REJECT BOOKING
====================================== */
router.post(
  "/bookings/:id/reject",
  auth,
  role(["PROVIDER"]),
  async (req, res) => {
    try {
      const booking = await Booking.findOne({
        _id: req.params.id,
        provider: req.user.id,
        status: "PENDING"
      });

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      booking.status = "REJECTED";
      await booking.save();

      // 🔹 HOTEL
      if (booking.bookingType === "HOTEL") {
        await Room.findByIdAndUpdate(booking.room, {
          status: "AVAILABLE"
        });
      }

      // 🔹 BUS
      if (booking.bookingType === "BUS") {
        await Seat.findByIdAndUpdate(booking.seat, {
          status: "AVAILABLE"
        });
      }

      res.json({ message: "Booking rejected successfully" });
    } catch (err) {
      console.error("REJECT BOOKING ERROR:", err);
      res.status(500).json({ message: "Failed to reject booking" });
    }
  }
);



module.exports = router;
