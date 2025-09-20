// Importing express from express
const express = require("express");

// Creating a new instance of expressJS application or
// we are creating a new server on express js
const app = express();

// to access this server we need to use listen(port) method with portnumber in parenthesis, like
// we can have a callback function in listen(), like
app.listen(3000, () => {
  console.log("server is running");
});

// After this we need to handle the request for that we have use() method
// which takes request and respone like
app.use("/dashboard", (req, res) => {
  res.send("welcome to dashboard");
});

app.use("/test", (req, res) => {
  res.send("hello from test");
});

app.use("/hello", (req, res) => {
  res.send("Hello from hello");
});
