// const express = require('express');
// const router = express.Router();
// const sendNotification = require('../firebase/sendNotification'); // Adjust path
// const saveToken = require('../controllers/notificationController');
// const verifyUser = require('../middlewares/verification');

// router.post('/save-token', verifyUser.verifyToken, saveToken);

// router.post('/send-notification', async (req, res) => {
//     const { token, title, body } = req.body;

//     if (!token || !title || !body) {
//         return res.status(400).json({ message: 'Missing fields' });
//     }
//     try {
//         console.log('Sending Notification:', { token, title, body });
//         await sendNotification(token, title, body);
//         res.json({ message: 'Notification sent' });
//     } catch (err) {
//         console.error('❌ Notification Error:', err);
//         res.status(500).json({ message: 'Failed to send notification' });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const sendNotification = require('../firebase/sendNotification');
const saveToken = require('../controllers/notificationController');
const verifyUser = require('../middlewares/verification');

// Save FCM Token (Authenticated Route)
router.post('/save-token', verifyUser.verifyToken, saveToken);

// Send Notification (Single Device)
router.post('/send-notification', async (req, res) => {
    const { token, title, body, postId } = req.body;

    if (!token || !title || !body || !postId) {
        return res.status(400).json({ message: 'Missing token, title, body, or postId' });
    }

    try {
        console.log('Sending Notification:', { token, title, body, postId });
        await sendNotification(token, title, body, postId);
        res.json({ message: 'Notification sent' });
    } catch (err) {
        console.error('❌ Notification Error:', err.message, err);
        res.status(500).json({ message: 'Failed to send notification' });
    }
});

module.exports = router;
