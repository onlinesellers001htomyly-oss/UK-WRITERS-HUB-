const express = require("express");
const router = express.Router();
const db = require("./database");

// Approve membership payment
router.post("/approve-deposit/:id", (req, res) => {

    const deposit = db.deposits.find(
        d => d.id == req.params.id
    );

    if (!deposit) {
        return res.status(404).json({
            success: false,
            message: "Deposit not found."
        });
    }

    deposit.status = "Approved";

    const user = db.users.find(
        u => u.id === deposit.userId
    );

    if (user) {
        user.status = "Active";
    }

    res.json({
        success: true,
        message: "Membership activated successfully."
    });

});

// Approve withdrawal
router.post("/approve-withdrawal/:id", (req, res) => {

    const withdrawal = db.withdrawals.find(
        w => w.id == req.params.id
    );

    if (!withdrawal) {
        return res.status(404).json({
            success: false,
            message: "Withdrawal not found."
        });
    }

    withdrawal.status = "Approved";

    const user = db.users.find(
        u => u.id === withdrawal.userId
    );

    if (user) {
        user.balance -= withdrawal.amount;
    }

    res.json({
        success: true,
        message: "Withdrawal approved."
    });

});

module.exports = router;
