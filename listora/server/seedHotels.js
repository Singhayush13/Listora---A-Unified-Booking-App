const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Hotel = require("./models/Hotel");

async function seedHotels() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Find a provider
    const provider = await User.findOne({ role: "PROVIDER" });

    if (!provider) {
      console.log("❌ No PROVIDER found. Run user seed first.");
      process.exit();
    }

    // Clear existing hotels (optional)
    await Hotel.deleteMany();

    const hotels = [
      {
        provider: provider._id,
        name: "Hotel Blue Orchid",
        address: "Andheri East, Mumbai",
        phone: "9876543210",
        pricePerNight: 2500,
        amenities: ["Free WiFi", "AC", "Parking"],
        foodAvailable: true,
        foodTypes: ["Veg", "Non-Veg"],
        images: [
          "https://source.unsplash.com/800x600/?hotel,room",
          "https://source.unsplash.com/800x600/?hotel,lobby"
        ],
        rooms: 20,
        rating: 4.3
      },
      {
        provider: provider._id,
        name: "Sea View Residency",
        address: "Juhu Beach, Mumbai",
        phone: "9123456780",
        pricePerNight: 4200,
        amenities: ["Sea View", "AC", "Breakfast Included"],
        foodAvailable: true,
        foodTypes: ["Veg"],
        images: [
          "https://source.unsplash.com/800x600/?beach,hotel"
        ],
        rooms: 15,
        rating: 4.7
      },
      {
        provider: provider._id,
        name: "Budget Stay Inn",
        address: "Borivali West, Mumbai",
        phone: "9988776655",
        pricePerNight: 1200,
        amenities: ["Non-AC", "Free WiFi"],
        foodAvailable: false,
        foodTypes: [],
        images: [
          "https://source.unsplash.com/800x600/?budget,hotel"
        ],
        rooms: 30,
        rating: 3.8
      },
      {
        provider: provider._id,
        name: "Royal Palace Hotel",
        address: "Connaught Place, Delhi",
        phone: "9012345678",
        pricePerNight: 5500,
        amenities: ["Luxury Rooms", "AC", "Gym", "Swimming Pool"],
        foodAvailable: true,
        foodTypes: ["Veg", "Non-Veg", "Continental"],
        images: [
          "https://source.unsplash.com/800x600/?luxury,hotel"
        ],
        rooms: 25,
        rating: 4.9
      },
      {
        provider: provider._id,
        name: "Green Valley Resort",
        address: "Lonavala, Maharashtra",
        phone: "9090909090",
        pricePerNight: 3800,
        amenities: ["Mountain View", "AC", "Swimming Pool"],
        foodAvailable: true,
        foodTypes: ["Veg", "Non-Veg"],
        images: [
          "https://source.unsplash.com/800x600/?resort,mountains"
        ],
        rooms: 18,
        rating: 4.5
      }
    ];

    await Hotel.insertMany(hotels);

    console.log("✅ Hotels seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedHotels();
