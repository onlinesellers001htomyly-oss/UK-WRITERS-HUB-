const express = require("express");
const router = express.Router();
const db = require("./database");

// Submit withdrawal request
router.post("/", (req, res) => {

    const { userId, amount, method } = req.body;

    const user = db.users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    if (amount > user.balance) {
        return res.status(400).json({
            success: false,
            message: "Insufficient balance."
        });
    }

    const withdrawal = {
        id: db.withdrawals.length + 1,
        userId,
        amount,
        method,
        status: "Pending",
        date: new Date()
    };

    db.withdrawals.push(withdrawal);

    res.json({
        success: true,
        message: "Withdrawal request submitted successfully.",
        withdrawal
    });

});

// Get all withdrawal requests
router.get("/", (req, res) => {

    res.json(db.withdrawals);

});

module.exports = router;
