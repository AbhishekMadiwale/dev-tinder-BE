// Importing express from express
const express = require("express");

const connectDB = require("./config/database");
const User = require("./models/user");

// Creating a new instance of expressJS application or
// we are creating a new server on express js
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User addedd successfully");
  } catch (err) {
    res.status(400).send("Error in adding user: " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailid;

  try {
    const users = await User.find({ emailid: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch {
    res.status(404).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userID = req.body.userId;
  const user = await User.findOneAndDelete(userID);

  if (!user) {
    res.status(404).send("user not found");
  } else {
    res.status(200).send("User deleted successfully");
  }
});

app.patch("/user", async (req, res) => {
  const userEmail = req.body.emailid;
  const data = req.body;
  try {
    await User.findOneAndUpdate({ emailid: userEmail }, data, {
      runValidators: true,
    });
    res.send("User is updated");
  } catch (err) {
    res.status(400).send("Updated info is wrong:" + err.message);
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
