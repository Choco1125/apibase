const nodemailer = require('nodemailer');
const { config } = require("./../../config/config")

const transporter = nodemailer.createTransport({
  host: config.mailHost,
  port: config.mailPort,
  secure: true,
  auth: {
    user: config.mailUser,
    pass: config.mailPassword
  }
});


async function sendMail(to, subject, html, attachments = []) {
  try {
    await transporter.sendMail({
      from: `${config.mailUsername} <${config.mailUser}>`,
      to,
      subject,
      html,
      attachments
    });

    return 'Mail sent';
  } catch (error) {
    throw new Error("Mail error :", error);
  }

}

module.exports = sendMail;
