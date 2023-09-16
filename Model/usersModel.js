const mongoose = require("mongoose");

// defining a schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please add the user name"],
  },
  email: {
    type: String,
    required: [true, "please add the email address"],
    unique: [true, "email already taken"],
  },
  password: {
    type: String,
    required: [true, "please add password"],
  },
  resetToken: {
    type: String,
  },
});

// create a model
module.exports = mongoose.model("User", userSchema, "users");
