const express = require("express");
const profileRouter = express.Router();
// Getting the middleware
const { userAuth } = require("../middleware/auth");

profileRouter.post("/profile", userAuth, async (req, res) => {
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

module.exports = profileRouter;
