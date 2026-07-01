const express = require("express");
const router = express.Router();
const db = require("./database");

// Get all tasks
router.get("/", (req, res) => {

    res.json(db.tasks);

});

// Get tasks by category
router.get("/category/:category", (req, res) => {

    const category = req.params.category;

    const tasks = db.tasks.filter(
        t => t.category === category
    );

    res.json(tasks);

});

// Add new task
router.post("/", (req, res) => {

    const task = {

        id: db.tasks.length + 1,

        title: req.body.title,

        category: req.body.category,

        budget: req.body.budget,

        deadline: req.body.deadline,

        description: req.body.description,

        status: "Open",

        created: new Date()

    };

    db.tasks.push(task);

    res.json({

        success:true,

        message:"Task created successfully.",

        task

    });

});

module.exports = router;
