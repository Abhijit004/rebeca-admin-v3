const express = require('express');
const authController = require('../controllers/authController');
const checkAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/google-login', authController.googleAuth);
router.get('/checkStatus', checkAuth, authController.getMe);
router.get('/logout', authController.logout);

module.exports = router;