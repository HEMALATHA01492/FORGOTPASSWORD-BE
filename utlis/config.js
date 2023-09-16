require("dotenv").config();

const URL = process.env.MONGODB;
const PORT = process.env.PORT;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

module.exports = {
  URL,
  PORT,
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
};
