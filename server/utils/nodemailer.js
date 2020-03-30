require("dotenv").config();

const nodemailer = require("nodemailer");
const mandrill_key = process.env.MANDRILL_KEY;

const transporter = nodemailer.createTransport(
  {
    service: "Mandrill",
    auth: {
      user: "info@rithmschool.com",
      pass: mandrill_key
    }
  },
  {
    from: "Elie Schoppik <info@rithmschool.com>"
  }
);

const DEFAULT_MESSAGE = {
  to: '"Elie Schoppik" <elie@rithmschool.com>',
  subject: "Nodemailer is the best!",
  text: "HI THERE!"
};

async function sendMail(message = DEFAULT_MESSAGE) {
  const response = await transporter.sendMail(message);
  return response;
}

module.exports = { sendMail };
