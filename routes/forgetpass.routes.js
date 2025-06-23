const express = require('express');
const router = express.Router();
const auth = require('../middlewares/verification')
const { forgotPassword, resetPassword, changePassword, checkResetStatus } = require('../controllers/forgetpassword.controller');

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', auth.verifyToken, changePassword);
router.post('/check-reset-status', checkResetStatus);

module.exports = router;
