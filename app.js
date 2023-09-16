require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { log, error } = require("./utlis/logger");
const { URL, PORT } = require("./utlis/config");
const usersRouter = require("./Controller/usersRoutes");

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", false);

mongoose
  .connect(URL)
  .then(() => {
    log("connected to mongoDB");
  })
  .catch((err) => {
    error(err);
  });

app.get("/", (req, res) => {
  res.send("<h1>FORGOT PASSWORD BACKEND</h1>");
});

app.use(usersRouter);

module.exports = app;
