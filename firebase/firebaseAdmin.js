// const admin = require('firebase-admin');

// // Replace with your actual service account JSON file path
// // const serviceAccount = require('./soulreads-d5049-firebase-adminsdk-fbsvc-1f6df4b29a.json');

// admin.initializeApp({
//     credential: admin.credential.cert({
//         type: "service_account",
//         project_id:process.env.FIREBASE_project_id,
//         private_key_id:process.env.FIREBASE_private_key_id,
//         private_key:process.env.FIREBASE_private_key,
//         client_email:process.env.FIREBASE_client_email,
//         client_id:process.env.FIREBASE_client_id,
//         auth_uri:process.env.FIREBASE_auth_uri,
//         token_uri:process.env.FIREBASE_token_uri,
//         auth_provider_x509_cert_url:process.env.FIREBASE_auth_provider_x509_cert_url,
//         client_x509_cert_url:process.env.FIREBASE_client_x509_cert_url,
//         universe_domain:process.env.FIREBASE_universe_domain,
//     }),
// });

// module.exports = admin;



const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    }),
});

module.exports = admin;
