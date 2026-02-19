const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Bus = require("./models/Bus");
const Seat = require("./models/Seat");

async function seedBuses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // 🔹 Find provider
    const provider = await User.findOne({ role: "PROVIDER" });

    if (!provider) {
      console.log("❌ No PROVIDER found. Create provider first.");
      process.exit();
    }

    // 🔥 Clear old data
    await Bus.deleteMany();
    await Seat.deleteMany();

    console.log("Old buses & seats removed");

    const buses = [
      {
        provider: provider._id,
        busName: "Listora Express",
        busNumber: "MH-01-AX-1010",
        from: "Mumbai",
        to: "Pune",
        departureTime: "22:00",
        arrivalTime: "06:00",
        pricePerSeat: 850,
        totalSeats: 40,
        busType: "AC",
        suspension: "Air Suspension"
      },
      {
        provider: provider._id,
        busName: "Night Rider",
        busNumber: "MH-02-BX-2020",
        from: "Mumbai",
        to: "Goa",
        departureTime: "20:30",
        arrivalTime: "08:00",
        pricePerSeat: 1400,
        totalSeats: 36,
        busType: "AC",
        suspension: "Air Suspension"
      },
      {
        provider: provider._id,
        busName: "Green Line Travels",
        busNumber: "DL-01-GT-3030",
        from: "Delhi",
        to: "Jaipur",
        departureTime: "18:00",
        arrivalTime: "23:30",
        pricePerSeat: 650,
        totalSeats: 32,
        busType: "NON-AC",
        suspension: "Normal Suspension"
      },
      {
        provider: provider._id,
        busName: "Southern Comfort",
        busNumber: "KA-05-SC-4040",
        from: "Bangalore",
        to: "Chennai",
        departureTime: "21:00",
        arrivalTime: "06:30",
        pricePerSeat: 1100,
        totalSeats: 44,
        busType: "AC",
        suspension: "Air Suspension"
      },
      {
        provider: provider._id,
        busName: "Royal Cruiser",
        busNumber: "MH-12-RC-5050",
        from: "Pune",
        to: "Nagpur",
        departureTime: "19:45",
        arrivalTime: "07:15",
        pricePerSeat: 900,
        totalSeats: 38,
        busType: "NON-AC",
        suspension: "Normal Suspension"
      }
    ];

    for (const busData of buses) {
      const bus = await Bus.create(busData);

      // 🔹 AUTO CREATE SEATS
      const seats = [];
      for (let i = 1; i <= bus.totalSeats; i++) {
        seats.push({
          bus: bus._id,
          seatNumber: `S${i}`,
          status: "AVAILABLE"
        });
      }

      await Seat.insertMany(seats);

      console.log(
        `✅ ${bus.busName} created with ${bus.totalSeats} seats`
      );
    }

    console.log("🎉 Bus seeding completed successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seedBuses();
