const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  // Read the token from the cookie
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }

    // Validate the token from jwt
    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
