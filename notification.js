const express = require("express");
const router = express.Router();
const db = require("./database");

// Get notifications for a user
router.get("/:userId", (req, res) => {

    const userId = Number(req.params.userId);

    const notifications = db.notifications.filter(
        n => n.userId === userId
    );

    res.json(notifications);

});

// Create a notification
router.post("/", (req, res) => {

    const notification = {

        id: db.notifications.length + 1,

        userId: req.body.userId,

        title: req.body.title,

        message: req.body.message,

        read: false,

        date: new Date()

    };

    db.notifications.push(notification);

    res.json({

        success: true,

        message: "Notification created successfully.",

        notification

    });

});

// Mark notification as read
router.put("/:id/read", (req, res) => {

    const notification = db.notifications.find(
        n => n.id == req.params.id
    );

    if (!notification) {

        return res.status(404).json({

            success: false,

            message: "Notification not found."

        });

    }

    notification.read = true;

    res.json({

        success: true,

        message: "Notification marked as read."

    });

});

module.exports = router;
