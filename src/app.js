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
    res.send(400).send("Error in adding user: " + err.message);
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
