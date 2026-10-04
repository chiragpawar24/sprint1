const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// CREATE NOTIFICATION
router.post("/notifications", async (req, res) => {
  try {
    const {
      user,
      title,
      message,
      type,
    } = req.body;

    if (!user || !title || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide user, title and message",
      });
    }

    const notification =
      new Notification({
        user,
        title,
        message,
        type: type || "general",
      });

    await notification.save();

    return res.status(201).json({
      success: true,
      message:
        "Notification created successfully!",
      notification,
    });
  } catch (error) {
    console.log(
      "Create Notification Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create notification",
    });
  }
});

// GET USER NOTIFICATIONS
router.get(
  "/notifications/:userId",
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          user: req.params.userId,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      console.log(
        "Fetch Notification Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch notifications",
      });
    }
  }
);

// MARK ONE NOTIFICATION AS READ
router.put(
  "/notifications/:notificationId/read",
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndUpdate(
          req.params.notificationId,
          {
            read: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Notification marked as read",
        notification,
      });
    } catch (error) {
      console.log(
        "Read Notification Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update notification",
      });
    }
  }
);

// MARK ALL NOTIFICATIONS AS READ
router.put(
  "/notifications/user/:userId/read-all",
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          user: req.params.userId,
          read: false,
        },
        {
          read: true,
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.log(
        "Read All Notification Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update notifications",
      });
    }
  }
);

module.exports = router;