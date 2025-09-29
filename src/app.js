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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // here we are creating a cookie on Login API

      const token = await jwt.sign({ _id: user.id }, "DEV@Tinder$790");
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

app.post("/profile", async (req, res) => {
  // On profile API we are reading the cookie
  // to read the cookie we are using cookie-parser as a middleware
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodedMessage;
    console.log("Loggedin user is: " + _id);

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);

    res.send("Reading cookies");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
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
