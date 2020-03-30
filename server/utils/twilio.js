require("dotenv").config();

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN
const twilio_phone = process.env.TWILIO_PHONE

const Twilio = require("twilio");
const client = new Twilio(accountSid, authToken);

async function createMessage(to="+19734950109", body="Hello world!") {
  const message = await client.messages.create({
    body,
    to,
    from: twilio_phone
  });
  return message;
}

module.exports = { createMessage };