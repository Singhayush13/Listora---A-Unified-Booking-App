const router = require("express").Router();
const Bus = require("../models/Bus");
const Seat = require("../models/Seat");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

/* ======================================================
   CREATE BUS (PROVIDER ONLY) + AUTO CREATE SEATS
====================================================== */
router.post(
  "/",
  auth,
  role(["PROVIDER"]),
  async (req, res) => {
    try {
      const {
        busName,
        departure,
        destination,
        ac,
        suspension,
        totalSeats,
        pricePerSeat
      } = req.body;

      const bus = await Bus.create({
        provider: req.user.id,
        busName,
        departure,
        destination,
        ac,
        suspension,
        totalSeats: Number(totalSeats),
        pricePerSeat: Number(pricePerSeat)
      });

      /* 🔹 AUTO CREATE SEATS */
      const seats = [];
      for (let i = 1; i <= bus.totalSeats; i++) {
        seats.push({
          bus: bus._id,
          seatNumber: `S${i}`,
          status: "AVAILABLE"
        });
      }
      await Seat.insertMany(seats);

      res.status(201).json(bus);
    } catch (err) {
      console.error("BUS CREATE ERROR:", err);
      res.status(500).json({ message: "Failed to create bus" });
    }
  }
);

/* ======================================================
   GET ALL BUSES (PUBLIC)
====================================================== */
/* ======================================================
   GET ALL BUSES (PUBLIC) + AVAILABLE SEATS
====================================================== */
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find()
      .populate("provider", "name");

    const busesWithAvailability = await Promise.all(
      buses.map(async (bus) => {
        const availableSeats = await Seat.countDocuments({
          bus: bus._id,
          status: "AVAILABLE"
        });

        return {
          ...bus.toObject(),
          availableSeats // ✅ dynamic seat count
        };
      })
    );

    res.json(busesWithAvailability);
  } catch (err) {
    console.error("GET BUSES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch buses" });
  }
});


/* ======================================================
   GET SINGLE BUS (PUBLIC)
====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate("provider", "name");

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(bus);
  } catch (err) {
    console.error("GET BUS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch bus" });
  }
});

/* ======================================================
   GET PROVIDER BUSES
====================================================== */
router.get(
  "/provider/my",
  auth,
  role(["PROVIDER"]),
  async (req, res) => {
    const buses = await Bus.find({ provider: req.user.id });
    res.json(buses);
  }
);

/* ======================================================
   UPDATE BUS (PROVIDER ONLY)
====================================================== */
router.put(
  "/:id",
  auth,
  role(["PROVIDER"]),
  async (req, res) => {
    try {
      const bus = await Bus.findOneAndUpdate(
        { _id: req.params.id, provider: req.user.id },
        req.body,
        { new: true }
      );

      if (!bus) {
        return res.status(403).json({ message: "Not allowed" });
      }

      res.json(bus);
    } catch (err) {
      console.error("BUS UPDATE ERROR:", err);
      res.status(500).json({ message: "Failed to update bus" });
    }
  }
);

/* ======================================================
   DELETE BUS (PROVIDER / ADMIN)
====================================================== */
router.delete(
  "/:id",
  auth,
  role(["PROVIDER", "ADMIN"]),
  async (req, res) => {
    try {
      const query =
        req.user.role === "ADMIN"
          ? { _id: req.params.id }
          : { _id: req.params.id, provider: req.user.id };

      const bus = await Bus.findOneAndDelete(query);

      if (!bus) {
        return res.status(403).json({ message: "Not allowed" });
      }

      /* 🔥 DELETE ALL SEATS */
      await Seat.deleteMany({ bus: bus._id });

      res.json({ message: "Bus deleted successfully" });
    } catch (err) {
      console.error("BUS DELETE ERROR:", err);
      res.status(500).json({ message: "Failed to delete bus" });
    }
  }
);

module.exports = router;
