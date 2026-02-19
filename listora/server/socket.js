const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Message = require("./models/Message");
const Hotel = require("./models/Hotel");

module.exports = (io) => {

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = decoded.id;
      socket.role = decoded.role;

      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket) => {

    try {

      const userObjectId = new mongoose.Types.ObjectId(socket.userId);

      /* =====================================
         PROVIDER AUTO JOIN THEIR HOTELS
      ===================================== */
      if (socket.role === "PROVIDER") {
        const hotels = await Hotel.find({ provider: userObjectId }).select("_id");

        hotels.forEach(hotel => {
          socket.join(`hotel_${hotel._id}`);
        });
      }

      /* =====================================
         USER JOIN SPECIFIC HOTEL
      ===================================== */
      socket.on("joinHotel", ({ hotelId }) => {
        if (!mongoose.Types.ObjectId.isValid(hotelId)) return;

        socket.join(`hotel_${hotelId}`);
      });

      /* =====================================
         SEND MESSAGE
      ===================================== */
      socket.on("sendMessage", async ({ hotelId, receiverId, message }) => {

        if (
          !mongoose.Types.ObjectId.isValid(hotelId) ||
          !mongoose.Types.ObjectId.isValid(receiverId) ||
          !message?.trim()
        ) return;

        const newMessage = await Message.create({
          hotel: hotelId,
          sender: userObjectId,
          receiver: receiverId,
          message: message.trim()
        });

        const populatedMsg = await Message.findById(newMessage._id)
          .populate("sender", "name email role")
          .populate("receiver", "name email role");

        io.to(`hotel_${hotelId}`).emit("receiveMessage", populatedMsg);
      });

      /* =====================================
         CLEAN DISCONNECT
      ===================================== */
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.userId);
      });

    } catch (err) {
      console.error("Socket error:", err);
      socket.disconnect();
    }

  });

};
