const admin = require('./firebaseAdmin');

const sendNotification = async (deviceToken, title, body) => {
    if (!tokens.length) return;

    const message = {
        token: deviceToken,
        notification: {
            title,
            body,
        },
        webpush: {
            notification: {
                icon: 'https://soulreads-eta.vercel.app/images/logo%20SR.svg',
                click_action: `https://soulreads-eta.vercel.app/posts/${postId}`,
            },
            headers: {
                Urgency: 'high',
            },
        },
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('✅ Notification sent, FCM Response:', response);
    } catch (error) {
        console.error('❌ Error sending notification:', error.message, error);
    }
};

module.exports = sendNotification;
