const router = require("express").Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Bus = require("../models/Bus");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

/* =====================================================
   ADMIN DASHBOARD COMPLETE STATS
===================================================== */
router.get("/stats", auth, role(["ADMIN"]), async (req, res) => {
  try {
    const [
      totalBookings,
      totalUsers,
      totalProviders,
      totalHotels,
      totalBuses,
      revenue,
      statusStats,
      typeStats
    ] = await Promise.all([

      Booking.countDocuments(),

      User.countDocuments({ role: "USER" }),

      User.countDocuments({ role: "PROVIDER" }),

      Hotel.countDocuments(),

      Bus.countDocuments(),

      // 🔥 Total Revenue (Only Confirmed)
      Booking.aggregate([
        { $match: { status: "CONFIRMED" } },
        { $group: { _id: null, total: { $sum: "$amountPaid" } } }
      ]),

      // 🔥 Booking Status Count
      Booking.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),

      // 🔥 Booking Type Count
      Booking.aggregate([
        {
          $group: {
            _id: "$bookingType",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      totalBookings,
      totalUsers,
      totalProviders,
      totalHotels,
      totalBuses,
      totalRevenue: revenue[0]?.total || 0,
      statusStats,
      typeStats
    });

  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    res.status(500).json({ message: "Admin stats failed" });
  }
});


/* =====================================================
   MONTHLY REVENUE (Line Graph)
===================================================== */
router.get("/monthly-revenue", auth, role(["ADMIN"]), async (req, res) => {
  try {
    const revenue = await Booking.aggregate([
      { $match: { status: "CONFIRMED" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amountPaid" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(revenue);

  } catch (err) {
    console.error("MONTHLY REVENUE ERROR:", err);
    res.status(500).json({ message: "Monthly revenue failed" });
  }
});


/* =====================================================
   BOOKING TYPE ANALYTICS
===================================================== */
router.get("/booking-types", auth, role(["ADMIN"]), async (req, res) => {
  try {
    const types = await Booking.aggregate([
      {
        $group: {
          _id: "$bookingType",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(types);

  } catch (err) {
    console.error("BOOKING TYPE ERROR:", err);
    res.status(500).json({ message: "Booking type fetch failed" });
  }
});


/* =====================================================
   BOOKING STATUS ANALYTICS
===================================================== */
router.get("/booking-status", auth, role(["ADMIN"]), async (req, res) => {
  try {
    const status = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(status);

  } catch (err) {
    console.error("BOOKING STATUS ERROR:", err);
    res.status(500).json({ message: "Booking status fetch failed" });
  }
});


/* =====================================================
   GET ALL USERS
===================================================== */
router.get("/users", auth, role(["ADMIN"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);

  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


/* =====================================================
   DELETE USER
===================================================== */
router.delete("/users/:id", auth, role(["ADMIN"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: "User deletion failed" });
  }
});


/* =====================================================
   GET ALL PROVIDERS
===================================================== */
router.get("/providers", auth, role(["ADMIN"]), async (req, res) => {
  try {
    const providers = await User.aggregate([
      { $match: { role: "PROVIDER" } },

      {
        $lookup: {
          from: "hotels",
          localField: "_id",
          foreignField: "provider",
          as: "hotels"
        }
      },

      {
        $lookup: {
          from: "buses",
          localField: "_id",
          foreignField: "provider",
          as: "buses"
        }
      },

      {
        $project: {
          name: 1,
          email: 1,
          isSuspended: 1,
          createdAt: 1,
          hotelCount: { $size: "$hotels" },
          busCount: { $size: "$buses" }
        }
      }
    ]);

    res.json(providers);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch providers" });
  }
});



/* =====================================================
   SUSPEND / ACTIVATE PROVIDER
===================================================== */
router.put("/providers/:id/suspend", auth, role(["ADMIN"]), async (req, res) => {
  try {
    const provider = await User.findById(req.params.id);

    if (!provider || provider.role !== "PROVIDER") {
      return res.status(404).json({ message: "Provider not found" });
    }

    provider.isSuspended = !provider.isSuspended;
    await provider.save();

    res.json({
      message: provider.isSuspended
        ? "Provider suspended successfully"
        : "Provider activated successfully"
    });

  } catch (err) {
    console.error("SUSPEND PROVIDER ERROR:", err);
    res.status(500).json({ message: "Provider update failed" });
  }
});


module.exports = router;
