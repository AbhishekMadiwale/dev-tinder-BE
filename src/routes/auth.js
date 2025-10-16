const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

// bycrypt is a library to help you hash passwords.
const validator = require("validator");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const user = new User(req.body);
  const { firstName, lastName, emailId, password } = req.body;

  try {
    // validating the data first
    validateSignUpData(req);

    // Encrypting the password
    const passwordHash = await bcrypt.hash(password, 10);

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

authRouter.post("/login", async (req, res) => {
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

      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      throw new Error("check password");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out successfully");
});

module.exports = authRouter;
