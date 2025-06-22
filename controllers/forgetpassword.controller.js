const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const sendPasswordResetEmail = require('../utils/sendPasswordResetEmail');

exports.forgotPassword = async (req, res) => {

    const { email } = req.body;
    console.log("Received forgot-password request for:", email);
    // const user = await User.findOne({ email });
    let user = await User.findOne({
        email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    console.log("User found?", user);
    if (!user)
        return res.status(400).json({ message: 'Email not found.' });

    if (!user.verified)
        return res.status(403).json({ message: 'Please verify your email before resetting password.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendPasswordResetEmail(user.email, token);

    res.json({ message: 'Reset link sent to your email.' });
};


exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
};


exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // set by authenticateUser middleware
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedNew = await bcrypt.hash(newPassword, 12);
    user.password = hashedNew;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
