const router = require("express").Router();
const mongoose = require("mongoose");
const Message = require("../models/Message");
const Hotel = require("../models/Hotel");
const User = require("../models/User");
const auth = require("../middleware/auth");

/* =====================================
   GET CONVERSATIONS (Navbar Menu)
   One conversation per HOTEL + USER
===================================== */
router.get("/conversations", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const chats = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },

      { $sort: { createdAt: -1 } },

      {
        $group: {
          _id: {
            hotel: "$hotel",
            otherUser: {
              $cond: [
                { $eq: ["$sender", userId] },
                "$receiver",
                "$sender"
              ]
            }
          },
          lastMessage: { $first: "$message" },
          updatedAt: { $first: "$createdAt" }
        }
      },

      { $sort: { updatedAt: -1 } }
    ]);

    // enrich with hotel name + provider name
    const enriched = await Promise.all(
      chats.map(async (c) => {
        const hotel = await Hotel.findById(c._id.hotel).select("name");
        const otherUser = await User.findById(c._id.otherUser).select("name");

        return {
          hotelId: c._id.hotel,
          receiverId: c._id.otherUser,
          hotelName: hotel?.name || "Hotel",
          providerName: otherUser?.name || "User",
          lastMessage: c.lastMessage,
          updatedAt: c.updatedAt
        };
      })
    );

    res.json(enriched);

  } catch (err) {
    console.error("CONVERSATION ERROR:", err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});


/* =====================================
   GET CHAT HISTORY
===================================== */
router.get("/:hotelId/:userId", auth, async (req, res) => {
  try {
    const { hotelId, userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(hotelId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.json([]);
    }

    const messages = await Message.find({
      hotel: hotelId,
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.json(messages);

  } catch (err) {
    console.error("CHAT HISTORY ERROR:", err);
    res.status(500).json([]);
  }
});

module.exports = router;
