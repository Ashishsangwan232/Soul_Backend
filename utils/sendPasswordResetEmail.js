require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendPasswordResetEmail(email, token) {
  const {
    BREVO_EMAIL_KEY,
    BREVO_EMAIL,
    BREVO_HOST,
    BREVO_HOST_PORT,
    API_ORIGIN
  } = process.env;

  if (!BREVO_EMAIL_KEY || !BREVO_EMAIL || !BREVO_HOST || !BREVO_HOST_PORT || !API_ORIGIN) {
    throw new Error("Missing email configuration. Check environment variables.");
  }

  const resetLink = `${API_ORIGIN}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    host: BREVO_HOST,
    port: Number(BREVO_HOST_PORT),
    auth: {
      user: BREVO_EMAIL,
      pass: BREVO_EMAIL_KEY,
    },
  });

  await transporter.sendMail({
    from: `SoulReads <${BREVO_EMAIL}>`,
    to: email,
    subject: 'Reset Your Password - SoulReads',
    text: `A password reset was requested for your account. Use the following link to reset your password: ${resetLink}`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; color: #333;">
  <h2 style="color: #E53935;">Reset Your Password</h2>
  <p style="font-size: 16px;">
    A password reset was requested for your account. Click the button below to reset your password:
  </p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetLink}" style="background-color: #E53935; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
      Reset Password
    </a>
  </div>
  <p style="font-size: 14px; color: #777;">
    If the button doesn’t work, copy and paste the following link into your browser:
  </p>
  <p style="word-break: break-all; font-size: 14px; color: #555;">
    ${resetLink}
  </p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #aaa;">
    If you did not request a password reset, you can safely ignore this email.
  </p>
  <p style="font-size: 12px; color: #aaa;">
    &copy; ${new Date().getFullYear()} SoulReads. All rights reserved.
  </p>
</div>
    `,
  });
}

module.exports = sendPasswordResetEmail;
