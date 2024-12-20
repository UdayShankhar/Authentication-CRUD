const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: {
    name: "UdayShankhar",
    address: process.env.EMAIL_USER,
  },
  to: ["ushankhar52@gmail.com"],
  subject: "Hello ✔",
  text: "Hello world?",
  html: "<b>Hello world?</b>",
};

const sendMail = async (transporter,mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (err) {
    console.log(err);
  }
};

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch 👻" <shankhar87@gmail.com>', // sender address
//     to: "ushankhar52@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);
