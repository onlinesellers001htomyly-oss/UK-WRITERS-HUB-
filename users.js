const express = require("express");
const router = express.Router();
const db = require("./database");
const authenticate = require("./auth");

// Get all users
router.get("/", (req, res) => {
    res.json(db.users);
});

router.get("/", authenticate, (req, res) => {

    res.json(db.users);

});

// Get one user by ID
router.get("/:id", (req, res) => {

    const id = Number(req.params.id);

    const user = db.users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    res.json(user);
});

// Update user
router.put("/:id", (req, res) => {

    const id = Number(req.params.id);

    const user = db.users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    Object.assign(user, req.body);

    res.json({
        success: true,
        message: "User updated successfully.",
        user
    });

});

module.exports = router;
