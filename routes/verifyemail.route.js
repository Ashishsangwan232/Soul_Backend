// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const crypto = require("crypto");
const sendVerificationEmail = require('../utils/sendVerificationEmail');

// GET /api/auth/verify-email?token=abc123
router.get('/verify-email', async (req, res) => {
    try {
        // const { token } = req.query;
        const { token, redirect } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Token is missing' });
        }

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        if (user.verificationTokenExpires < Date.now()) {
            return res.status(400).json({ message: 'Token has expired. Please request a new one.' });
        }

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        
        if (redirect) {
            return res.redirect(302, redirect);
        }
        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });

        // Optional: redirect to frontend success page instead
        // res.redirect('http://localhost:3000/verify-success');
    } catch (err) {
        console.error('Verification error:', err);
        res.status(500).json({ message: 'Server error during verification' });
    }
});

// POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({
        email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    if (user.verified) {
        return res.status(400).json({ message: "Email already verified." });
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');
    user.verificationToken = token;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    await sendVerificationEmail(user.email, token);

    res.status(200).json({ message: "Verification email resent." });
});


module.exports = router;
