// Importing express from express
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

// bycrypt is a library to help you hash passwords.
const bcrypt = require("bcrypt");
const validator = require("validator");

// Creating a new instance of expressJS application or
// we are creating a new server on express js
const app = express();

// cookie-parser is a middleware which helps us to read cookies
const cookieParser = require("cookie-parser");

// Imporint webtoken to create and verify the token
const jwt = require("jsonwebtoken");

// Getting the middleware
const { userAuth } = require("./middleware/auth");

// importing the express json middleware to parse the incoming request body as JSON
app.use(express.json());

// importing cookie-parser as a middleware to read the cookies
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  const { firstName, lastName, emailId, password } = req.body;

  try {
    // validating the data first
    validateSignUpData(req);

    // Encrypting the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Please check the emailID");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // here we are creating a cookie on Login API

      const token = await user.getJWT();

      console.log(token);
      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      throw new Error("check password");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/profile", userAuth, async (req, res) => {
  // On profile API we are reading the cookie
  // to read the cookie we are using cookie-parser as a middleware
  try {
    const user = req.user;
    res.send(user);

    res.send("Reading cookies");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  // Sending the connection request
  try {
    res.send(user.firstName + " sending a connection request");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database is connected");
    app.listen(3000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });

// to access this server we need to use listen(port) method with portnumber in parenthesis, like
// we can have a callback function in listen(), like
