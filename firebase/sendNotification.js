const admin = require('./firebaseAdmin'); // Adjust path

const sendNotification = async (deviceToken, title, body) => {
    const message = {
        token: deviceToken,
        notification: {
            title: title,
            body: body,
        },
        webpush: {
            notification: {
                icon: 'https://soulreads-eta.vercel.app/images/logo%20SR.svg',
            },
        },
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('✅ Notification sent:', response);
    } catch (error) {
        console.error('❌ Error sending notification:', error);
    }
};

module.exports = sendNotification;
