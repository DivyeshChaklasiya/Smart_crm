const nodemailer = require("nodemailer");

// 🔥 EMAIL FUNCTION
const sendEmail = async (to, subject, text) => {
  try {
    // 🔐 TRANSPORTER (GMAIL CONNECT)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "chaklasiyadivyesh@gmail.com", // 🔥 change karo
        pass: "fmxtpklysprnthzp",    // 🔥 change karo
      },
    });

    // 📧 EMAIL DETAILS
    const mailOptions = {
      from: "YOUR_GMAIL@gmail.com",
      to: to,
      subject: subject,
      text: text,
    };

    // 🚀 SEND MAIL
    await transporter.sendMail(mailOptions);

    console.log("Email sent ✅");
  } catch (error) {
    console.log("Email error ❌:", error);
  }
};

module.exports = sendEmail;