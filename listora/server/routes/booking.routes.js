const router = require('express').Router();
const Booking = require('../models/Booking');
const Seat = require("../models/Seat");
const Room = require("../models/Room");
const auth = require('../middleware/auth');
const PDFDocument = require("pdfkit");


router.post("/", auth, async (req, res) => {
  const booking = await Booking.create({
    bookingType: "HOTEL", 
    user: req.user.id,
    provider: req.body.provider,
    hotel: req.body.hotel,
    room: req.body.room,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    amountPaid: req.body.amountPaid,
    status: "PENDING"
  });

  await Room.findByIdAndUpdate(req.body.room, {
    status: "PENDING"
  });

  res.json(booking);
});

/* ===============================
   BUS BOOKING (USER)
================================ */
router.post("/bus", auth, async (req, res) => {
  try {
    const booking = await Booking.create({
      bookingType: "BUS",
      user: req.user.id,
      provider: req.body.provider,
      bus: req.body.bus,
      seat: req.body.seat,
      fromDate: req.body.fromDate,
      amountPaid: req.body.amountPaid,
      status: "PENDING"
    });

    // mark seat pending
    await Seat.findByIdAndUpdate(req.body.seat, {
      status: "PENDING"
    });

    res.json(booking);
  } catch (err) {
    console.error("BUS BOOKING ERROR:", err);
    res.status(500).json({ message: "Bus booking failed" });
  }
});



/* GET MY BOOKINGS (Updated to populate room) */
router.get("/my", auth, async (req, res) => {
  const today = new Date();

  const bookings = await Booking.find({ user: req.user.id })
    .populate("hotel", "name")
    .populate("room", "roomNumber")
    .populate("bus", "busName departure destination")
    .populate("seat", "seatNumber")
    .sort({ createdAt: -1 });

  const upcoming = bookings.filter(b =>
    b.bookingType === "HOTEL"
      ? new Date(b.toDate) >= today
      : new Date(b.fromDate) >= today
  );

  const past = bookings.filter(b =>
    b.bookingType === "HOTEL"
      ? new Date(b.toDate) < today
      : new Date(b.fromDate) < today
  );

  res.json({ upcoming, past });
});

/* GET INVOICE */

router.get("/invoice/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .populate("hotel", "name address")
      .populate("room", "roomNumber")
      .populate("bus", "busName departure destination")
      .populate("seat", "seatNumber")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
});


module.exports = router;