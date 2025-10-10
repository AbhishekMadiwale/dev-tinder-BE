// Importing express from express
const express = require("express");
const connectDB = require("./config/database");

// Creating a new instance of expressJS application or
// we are creating a new server on express js
const app = express();

// cookie-parser is a middleware which helps us to read cookies
const cookieParser = require("cookie-parser");

// Imporint webtoken to create and verify the token
const jwt = require("jsonwebtoken");

// importing the express json middleware to parse the incoming request body as JSON
app.use(express.json());

// importing cookie-parser as a middleware to read the cookies
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("database is connected, running on port 3000");
    app.listen(3000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });

// to access this server we need to use listen(port) method with portnumber in parenthesis, like
// we can have a callback function in listen(), like
