const express = require("express");
const profileRouter = express.Router();
// Getting the middleware
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.post("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.send(`${loggedInUser.firstName} your profile is updated successfully`);
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

module.exports = profileRouter;
