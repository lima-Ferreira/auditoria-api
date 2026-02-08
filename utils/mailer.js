const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// sendMailWithBuffer({to, subject, text, filename, buffer})
async function sendMailWithBuffer({ to, subject, text, filename, buffer }) {
  if (!process.env.SMTP_HOST) throw new Error("SMTP não configurado no .env");

  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    text,
    attachments: [{ filename, content: buffer }],
  });

  return info;
}

module.exports = { sendMailWithBuffer };
