const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Add your admin routes here
router.get('/', (req, res) => {
    res.status(200).json({ message: "Admin routes" });
}); 
router.patch("/", adminController.updateAdmin)
module.exports = router;