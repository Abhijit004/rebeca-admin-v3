const express = require("express");

const router = express.Router();

// All your routes will go here
router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to rebeca backend v3" });
});

module.exports = router;