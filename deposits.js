const express = require("express");
const router = express.Router();
const db = require("./database");

// Submit membership payment
router.post("/", (req, res) => {

    const deposit = {

        id: db.deposits.length + 1,

        userId: req.body.userId,

        amount: req.body.amount,

        method: req.body.method,

        reference: req.body.reference,

        status: "Pending",

        date: new Date()

    };

    db.deposits.push(deposit);

    res.json({

        success: true,

        message: "Payment submitted successfully.",

        deposit

    });

});

// Get all deposits
router.get("/", (req, res) => {

    res.json(db.deposits);

});

module.exports = router;
