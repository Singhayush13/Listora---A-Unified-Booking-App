const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

/* =========================
   APP & SERVER
========================= */
const app = express();
const server = http.createServer(app);

/* =========================
   SOCKET.IO
========================= */
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 🔌 SOCKET LOGIC
require("./socket")(io);

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/hotels", require("./routes/hotel.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/chat", require("./routes/chat.routes"));
app.use("/api/rooms", require("./routes/room.routes"));
app.use("/api/provider", require("./routes/provider.routes"));
app.use("/api/buses", require("./routes/bus.routes"));
app.use("/api/seats", require("./routes/seat.routes"));




/* =========================
   DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
