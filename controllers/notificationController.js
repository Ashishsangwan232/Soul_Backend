const User = require('../models/user');

exports.saveToken = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming Auth Middleware adds `req.user`
        // const { token, userId } = req.body;
        const { token } = req.body;

        if (!token || !userId) {
            return res.status(400).json({ message: 'Missing token or userId' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fcmToken = token;
        await user.save();

        res.json({ message: 'FCM token saved successfully' });
    } catch (err) {
        console.error('Error saving FCM token:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
