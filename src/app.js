// Importing express from express
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

// Creating a new instance of expressJS application or
// we are creating a new server on express js
const app = express();

app.use(express.json());

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
  const userId = req.body.userId;
  const user = await User.findOneAndDelete(userId);

  if (!user) {
    res.status(404).send("user not found");
  } else {
    res.status(200).send("User deleted successfully");
  }
});

app.patch("/user/:userId", async (req, res) => {
  // const userId = req.body.userId;
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATED = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
      "password",
    ];

    const isUpdatedAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATED.includes(k)
    );

    if (!isUpdatedAllowed) {
      res.status(400).send("Updates are not valid");
    }

    if (data.skills && data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findOneAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });

    res.send("User is updated");
  } catch (err) {
    res.status(400).send("Updated info is wrong: " + err.message);
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
