const express = require("express");
const requestRouter = express.Router();
// Getting the middleware
const { userAuth } = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  // Sending the connection request
  try {
    res.send(user.firstName + " sending a connection request");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = requestRouter;
