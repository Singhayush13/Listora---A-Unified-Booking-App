const router = require("express").Router();
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const upload = require("../middleware/upload");

/* ======================================================
   GET ALL HOTELS (PUBLIC)
====================================================== */
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find().populate("provider", "name email");
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
});

/* ======================================================
   CREATE HOTEL (PROVIDER ONLY) + AUTO CREATE ROOMS
====================================================== */
router.post(
  "/",
  auth,
  role(["PROVIDER"]),
  upload.array("images", 5),
  async (req, res) => {
    try {
      const imageUrls = req.files?.map(f => f.path) || [];

      const hotel = await Hotel.create({
        provider: req.user.id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        pricePerNight: Number(req.body.pricePerNight),
        rooms: Number(req.body.rooms),
        amenities: req.body.amenities
          ? req.body.amenities.split(",").map(a => a.trim())
          : [],
        foodTypes: req.body.foodTypes
          ? req.body.foodTypes.split(",").map(f => f.trim())
          : [],
        foodAvailable: !!req.body.foodTypes,
        images: imageUrls
      });

      /* 🔹 AUTO CREATE ROOMS */
      const roomDocs = [];
      for (let i = 1; i <= hotel.rooms; i++) {
        roomDocs.push({
          hotel: hotel._id,
          roomNumber: `Room-${i}`,
          status: "AVAILABLE"
        });
      }
      await Room.insertMany(roomDocs);

      res.status(201).json(hotel);
    } catch (err) {
      console.error("HOTEL CREATE ERROR:", err);
      res.status(500).json({ message: "Hotel creation failed" });
    }
  }
);

/* ======================================================
   GET PROVIDER HOTELS
====================================================== */
router.get(
  "/provider/my",
  auth,
  role(["PROVIDER"]),
  async (req, res) => {
    const hotels = await Hotel.find({ provider: req.user.id });
    res.json(hotels);
  }
);

/* ======================================================
   GET SINGLE HOTEL (PROVIDER VIEW)
====================================================== */
router.get(
  "/provider/:id",
  auth,
  role(["PROVIDER"]),
  async (req, res) => {
    const hotel = await Hotel.findOne({
      _id: req.params.id,
      provider: req.user.id
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(hotel);
  }
);

/* ======================================================
   UPDATE HOTEL DETAILS + SYNC ROOMS (STEP-5)
====================================================== */
router.put(
  "/:id",
  auth,
  role(["PROVIDER"]),
  async (req, res) => {
    try {
      const hotel = await Hotel.findOne({
        _id: req.params.id,
        provider: req.user.id
      });

      if (!hotel) {
        return res.status(403).json({ message: "Not allowed" });
      }

      const oldRoomCount = hotel.rooms;
      const newRoomCount = Number(req.body.rooms);

      hotel.name = req.body.name;
      hotel.address = req.body.address;
      hotel.phone = req.body.phone;
      hotel.pricePerNight = Number(req.body.pricePerNight);
      hotel.rooms = newRoomCount;
      hotel.amenities = req.body.amenities
        ? req.body.amenities.split(",").map(a => a.trim())
        : [];
      hotel.foodTypes = req.body.foodTypes
        ? req.body.foodTypes.split(",").map(f => f.trim())
        : [];
      hotel.foodAvailable = !!req.body.foodTypes;

      await hotel.save();

      /* 🔹 SYNC ROOMS */
      if (newRoomCount > oldRoomCount) {
        const newRooms = [];
        for (let i = oldRoomCount + 1; i <= newRoomCount; i++) {
          newRooms.push({
            hotel: hotel._id,
            roomNumber: `Room-${i}`,
            status: "AVAILABLE"
          });
        }
        await Room.insertMany(newRooms);
      }

      if (newRoomCount < oldRoomCount) {
        const roomsToDelete = await Room.find({ hotel: hotel._id })
          .sort({ roomNumber: -1 })
          .limit(oldRoomCount - newRoomCount);

        const ids = roomsToDelete.map(r => r._id);
        await Room.deleteMany({ _id: { $in: ids } });
      }

      res.json(hotel);
    } catch (err) {
      console.error("HOTEL UPDATE ERROR:", err);
      res.status(500).json({ message: "Hotel update failed" });
    }
  }
);

/* ======================================================
   UPDATE HOTEL IMAGES
====================================================== */
router.post(
  "/:id/images",
  auth,
  role(["PROVIDER"]),
  upload.array("images", 5),
  async (req, res) => {
    try {
      const imageUrls = req.files?.map(f => f.path) || [];

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.id, provider: req.user.id },
        { images: imageUrls },
        { new: true }
      );

      if (!hotel) {
        return res.status(403).json({ message: "Not allowed" });
      }

      res.json(hotel);
    } catch (err) {
      res.status(500).json({ message: "Image update failed" });
    }
  }
);

/* ======================================================
   DELETE HOTEL (PROVIDER / ADMIN)
====================================================== */
router.delete(
  "/:id",
  auth,
  role(["PROVIDER", "ADMIN"]),
  async (req, res) => {
    const query =
      req.user.role === "ADMIN"
        ? { _id: req.params.id }
        : { _id: req.params.id, provider: req.user.id };

    const hotel = await Hotel.findOneAndDelete(query);

    if (!hotel) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Room.deleteMany({ hotel: hotel._id });

    res.json({ message: "Hotel deleted successfully" });
  }
);

/* ======================================================
   GET SINGLE HOTEL (PUBLIC)
====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate("provider", "name email");

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hotel" });
  }
});

module.exports = router;
