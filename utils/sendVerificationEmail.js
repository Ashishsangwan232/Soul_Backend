// utils/sendVerificationEmail.js
require('dotenv').config();

const nodemailer = require('nodemailer');

async function sendVerificationEmail(email, token) {

  const BREVO_EMAIL_KEY = process.env.BREVO_EMAIL_KEY;
  const BREVO_EMAIL = process.env.BREVO_EMAIL;
  const API_URL = process.env.API_URL;
  const API_ORIGIN =process.env.API_ORIGIN;
  const BREVO_HOST=process.env.BREVO_HOST;
  const BREVO_HOST_PORT=process.env.BREVO_HOST_PORT;
  const verifyLink = `${API_URL}/auth/verify-email?token=${token}&redirect=${API_ORIGIN}/verify-success`;

  console.log("Sending email to:", email);
  console.log("Verification link:", verifyLink);

  const transporter = nodemailer.createTransport({
    host: BREVO_HOST,
    port: BREVO_HOST_PORT,
    auth: {
      user: BREVO_EMAIL,     // your Brevo email/login
      pass: BREVO_EMAIL_KEY  // SMTP password generated from Brevo
    },
  });

  await transporter.sendMail({
    from: "SoulReads", // sender name
    to: email,
    subject: 'Verify your email',
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; color: #333;">
    <h2 style="color: #4CAF50;">Welcome to SoulReads!</h2>
    <p style="font-size: 16px;">
      Thank you for registering. To get started, please verify your email address by clicking the button below:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verifyLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
        Verify My Email
      </a>
    </div>
    <p style="font-size: 14px; color: #777;">
      If the button doesn’t work, copy and paste the following link into your browser:
    </p>
    <p style="word-break: break-all; font-size: 14px; color: #555;">
      ${verifyLink}
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="font-size: 12px; color: #aaa;">
      If you did not request this email, you can safely ignore it.
    </p>
    <p style="font-size: 12px; color: #aaa;">
      &copy; ${new Date().getFullYear()} SoulReads. All rights reserved.
    </p>
  </div>
`

  });
}

module.exports = sendVerificationEmail;
