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

// get keyword will match exact route
app.get("/user", (req, res) => {
  res.send({ firstName: "Abhishek ", lastName: "Madiwale" });
});

// we are making post call
app.post("/user", (req, res) => {
  console.log("Post call ");
  res.send("Data successfully saved to DB");
});

app.delete("/user", (req, res) => {
  console.log("delete call");
  res.send("User has been deleted");
});

app.put("/user", (req, res) => {
  res.send("Put method called successfully");
});

app.patch("/user", (req, res) => {
  res.send("Patch method called");
});

// All the HTTP methods are handled inside use
app.use("/test", (req, res) => {
  res.send("hello from test");
});
