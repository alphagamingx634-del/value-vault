const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email Sending Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;