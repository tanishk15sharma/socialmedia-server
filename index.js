const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helment = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to mongo");
  })
  .catch((e) => {
    console.log(e, "not connncted");
  });

// middleware
app.use(express.json());
app.use(helment());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(3300, () => {
  console.log("backend is runningg!!");
});
