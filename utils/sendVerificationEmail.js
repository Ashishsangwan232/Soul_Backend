require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendVerificationEmail(email, token) {
  const {
    BREVO_EMAIL_KEY,
    BREVO_EMAIL,
    BREVO_HOST,
    BREVO_HOST_PORT,
    API_URL,
    API_ORIGIN
  } = process.env;

  if (!BREVO_EMAIL_KEY || !BREVO_EMAIL || !BREVO_HOST || !BREVO_HOST_PORT || !API_URL || !API_ORIGIN) {
    throw new Error("Missing email configuration. Check environment variables.");
  }

  const verifyLink = `${API_URL}/auth/verify-email?token=${token}&redirect=${API_ORIGIN}/verify-success`;

  console.log("Sending verification email to:", email);
  console.log("Verification link:", verifyLink);

  const transporter = nodemailer.createTransport({
    host: BREVO_HOST,
    port: Number(BREVO_HOST_PORT),
    auth: {
      user: BREVO_EMAIL,
      pass: BREVO_EMAIL_KEY
    }
  });

  await transporter.sendMail({
    from: `SoulReads <${BREVO_EMAIL}>`,
    to: email,
    subject: 'Verify Your Email - SoulReads',
    text: `Welcome to SoulReads! Please verify your email by clicking this link: ${verifyLink}`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; color: #333;">
  <h2 style="color: #4CAF50;">Welcome to SoulReads!</h2>
  <p style="font-size: 16px;">
    Thank you for registering. Please verify your email by clicking the button below:
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
