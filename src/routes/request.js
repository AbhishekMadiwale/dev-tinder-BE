const express = require("express");
const requestRouter = express.Router();
// Getting the middleware
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid request type: " + status,
        });
      }

      const validUser = await user.findById(toUserId);
      if (!validUser) {
        return res.status(400).json({
          message: "User is not present",
        });
      }

      const existingConnetionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnetionRequest) {
        return res.status(400).json({
          message: "Connection request already exists",
        });
      }

      const ConnectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await ConnectionRequest.save();

      res.json({
        message: `${req.user.firstName} Interested in  ${validUser.firstName} `,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
    res.send(user.firstName + " sent the connect request!");
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      connectionRequest.status = status;

      let data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      return res.status(404).json({
        message: "Error: " + err.message,
      });
    }
  }
);

module.exports = requestRouter;
