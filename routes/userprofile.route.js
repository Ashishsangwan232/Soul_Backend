// routes/user.js
const express = require('express');
const router = express.Router();
const { userprofile } = require('../controllers/userprofile');
// GET public user profile by ID
router.get('/profile/:userId', userprofile);

module.exports = router;
