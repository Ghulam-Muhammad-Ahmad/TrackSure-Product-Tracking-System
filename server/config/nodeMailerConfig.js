// utils/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

// Reusable email template function
const generateEmailTemplate = (content) => {
    return `
    <!-- Wrapper Table -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 20px;">
    <tr>
      <td align="center">
        <!-- Main Container Table -->
        <table role="presentation" width="800" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
          <!-- Header Section -->
          <tr>
            <td style="background-color: #1b263b; color: #fff; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-family: Arial, sans-serif; 45px; font-weight:600; font-size:45px; color:#E0E1DD;">TrackSure</h2>
            </td>
          </tr>
          <!-- Content Section -->
          <tr>
            <td style="padding: 20px; font-family: Arial, sans-serif; color: #333333; font-size: 16px; line-height: 1.5;">
          ${content}
              <p>Best regards,<br>The TrackSure Team</p>
            </td>
          </tr>
          <!-- Footer Section -->
          <tr>
            <td style="background-color: #1b263b; color: #fff; padding: 15px; text-align: center; font-size: 12px; font-family: Arial, sans-serif;">
              <p>© ${new Date().getFullYear()} TrackSure. All rights reserved.</p>
              <p>Track Your Product and Grow</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
};

export const sendVerificationEmail = async (name, email, token) => {
    const url = `${process.env.BASE_URL}/verify-email?token=${token}`;

    const emailContent = `
       <p>Hello ${name},</p>
              <p>Thank you for joining TrackSure. We're excited to have you on board!</p>
              <p>To get started, please verify your email address by clicking the button below:</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td align="center" style="border-radius: 4px;" bgcolor="#1B263B">
                    <a href="${url}" style="display: inline-block; padding: 10px 20px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px; background-color: #1B263B;">Verify Your Email</a>
                  </td>
                </tr>
              </table>
              <p>If you did not sign up for TrackSure, please ignore this email.</p>
  `;

    await transporter.sendMail({
        from: "admin@tracksure.com",
        to: email,
        subject: 'Confirm your email to get started with TrackSure',
        html: generateEmailTemplate(emailContent)
    });
};

export const sendUserCreationEmail = async (userName, userEmail, tempPassword) => {
  const LoginUrl = `${process.env.BASE_URL}/login`;
    const emailContent = `
       <h2 style="font-size: 20px; margin-bottom: 10px;">Welcome, ${userName}</h2>
              <p style="margin: 0 0 15px;">An account has been created for you on the Tracksure platform.</p>
              <p style="margin: 0 0 15px;">Use the credentials below to log in:</p>
              <ul style="padding-left: 20px;">
                <li>Email: <strong>${userEmail}</strong></li>
                <li>Temporary Password: <strong>${tempPassword}</strong></li>
              </ul>
              <p style="margin: 0 0 20px;">Please change your password after your first login for security purposes.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${LoginUrl}" style="background-color: #1B263B; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Login to Tracksure
                </a>
              </div>
              <p style="font-size: 12px; color: #888888;">If you did not expect this email, you can ignore it.</p>
  `;

    await transporter.sendMail({
        from: "admin@tracksure.com",
        to: userEmail,
        subject: 'Your TrackSure Account is Ready',
        html: generateEmailTemplate(emailContent)
    });
};
