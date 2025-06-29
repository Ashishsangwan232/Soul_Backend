const User = require('../models/user');
const { choices, urls } = require('../config/avatars');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { newUsername, phoneNumber } = req.body;

        const updateData = {};

        // Check if new username is provided and valid
        if (newUsername && newUsername.trim() !== "") {
            // Check uniqueness
            const existingUser = await User.findOne({ username: newUsername.trim() });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: "Username already taken." });
            }
            updateData.username = newUsername;
        }

        // Check if phone number is provided
        if (phoneNumber && phoneNumber.trim() !== "") {
            const existingphoneNumber = await User.findOne({ phoneNumber: phoneNumber })
            if (existingphoneNumber && existingphoneNumber._id.toString() !== userId) {
                return res.status(400).json({ message: "Phone Number already existing." });
            }
            updateData.phoneNumber = phoneNumber;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid update fields provided." });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        res.status(200).json({
            message: "Profile updated successfully!",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber || null,
            },
        });

    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error. Could not update profile." });
    }
};


// controllers/userController.js
exports.updateAvatar = async (req, res) => {
    const userId = req.user.id;
    const { profilePicKey } = req.body;
    // console.log("pic updated Hit:", profilePicKey);
    // 1. Validate presence
    if (!profilePicKey) {
        return res.status(400).json({ error: 'profilePicKey is required' });
    }
    // 2. Validate choice
    if (!choices.includes(profilePicKey)) {
        return res
            .status(400)
            .json({ error: `Invalid profilePicKey. Must be one of: ${choices.join(', ')}` });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { profilePicKey: profilePicKey },
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            message: 'Avatar updated',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber || null,
                profilePicKey: user.profilePicKey,
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
