const express = require("express");
const Message = require("../models/Message");
const Notification = require("../models/Notification");

const router = express.Router();

// SEND MESSAGE
router.post("/messages", async (req, res) => {
  try {
    const {
      sender,
      receiver,
      message,
    } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide sender, receiver and message",
      });
    }

    // Save message
    const newMessage = new Message({
      sender,
      receiver,
      message,
    });

    await newMessage.save();

    // Get sender information
    await newMessage.populate(
      "sender",
      "name email role"
    );

    await newMessage.populate(
      "receiver",
      "name email role"
    );

    // Create notification for receiver
    await Notification.create({
      user: receiver,
      title: "New Message",
      message:
        `${newMessage.sender?.name || "Someone"} sent you a new message.`,
      type:
        newMessage.sender?.role === "mentor"
          ? "reply"
          : "message",
      read: false,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage,
    });

  } catch (error) {
    console.log(
      "Send Message Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});


// GET CHAT MESSAGES
router.get(
  "/messages/:user1/:user2",
  async (req, res) => {
    try {
      const {
        user1,
        user2,
      } = req.params;

      const messages = await Message.find({
        $or: [
          {
            sender: user1,
            receiver: user2,
          },
          {
            sender: user2,
            receiver: user1,
          },
        ],
      })
        .populate(
          "sender",
          "name email role"
        )
        .populate(
          "receiver",
          "name email role"
        )
        .sort({ createdAt: 1 });

      return res.status(200).json({
        success: true,
        messages: messages,
      });

    } catch (error) {
      console.log(
        "Fetch Messages Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to fetch messages",
      });
    }
  }
);

module.exports = router;