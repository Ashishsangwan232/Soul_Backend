const express = require('express');
const router = express.Router();
const sendNotification = require('../firebase/sendNotification'); // Adjust path

router.post('/send-notification', async (req, res) => {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    // try {
    //     await sendNotification(token, title, body);
    //     res.json({ message: 'Notification sent' });
    // } catch (err) {
    //     res.status(500).json({ message: 'Failed to send notification' });
    // }
    try {
        console.log('Sending Notification:', { token, title, body });
        await sendNotification(token, title, body);
        res.json({ message: 'Notification sent' });
    } catch (err) {
        console.error('❌ Notification Error:', err);
        res.status(500).json({ message: 'Failed to send notification' });
    }
});

// app.listen(5000, () => console.log('Server running on port 5000'));
module.exports = router;