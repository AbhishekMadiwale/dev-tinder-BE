# Nodemon

- We can use nodemon which will automatically refresh the server whenever we make any changes
- we don't need to manually close and start the server again and again

# Creating an express server

- we need to import express from express to create a server

  - import express = require("express");

- now we are creating a server naming app using express

  - const app = express()

- to access this server we need to use listen(port) method with portnumber in parenthesis, like

  - app.listen(3001);

# Request handlers

- After this we need to handle the request for that we have use() method
- which takes request and respone where we can use like function(req, res) or
- we can also use arrow functions

  - app.use((req, res) => {
    res.send("Hello from server)
    })

- the above code will give response for all routers, if we want to configure it with specific routes we need to
- define the routes before call back function, like
  - app.use("/test",(req, res) => {
    res.send("Hello from test)
    })
- this will print the message only if we go to {localhost:portNumber/test} route

- We can get the express middleware from app.use(express.json()), with this we are making the data dynamic
  and we can add custom input inside the json under raw and json format.

# Routing in Node

- order of code in NodeJS matters for routing like

  - app.use("/", (req, res) => {
    res.send("welcome to dashboard);
    })

  - app.use("/user", (req, res) => {
    res.send("welcome to user); // here we will still get the above message that is "welcome to dashboard"
    })

This is because order of the code

# HTTP Methods

- Get

  - app.get("/user", (req, res) => {
    res.send("Get method call");
    })

- Post

  - app.post("/user", (req, res) => {
    res.send("post method called");
    })

- Delete

  - app.delete("/user", (req, res) => {
    res.send("Delete method called");
    })

- Put
  app.put("/user", (req, res) => {
  res.send("Put method called")
  })

- Patch
  - app.patch("/user",(req, res) => {
    res.send("Patch method called")
    })

# MongoDB

- We need to create a cluster here inside this cluster we will create Database
- we will connect the cluster in compass, if u face issue with connection to compass, sync your IP on mongoDB
  dasboard.
- after this install mongoose library

# Mongoose

- we use to write schemas for MongoDB
- before listening the server, first connect to db
  - mongoose.connect() this function we will use
  - inside this function we need to pass the connection string from mongodDB dashboard, inside this string at the last we will need to give the database name inside our cluster
  - like, cluster name Movie, database name will be like horror or thriller
    "connect-movie/thriller"
- find() this will give us the users matching with the condition, multiple data will get
- findOne() this will give us the first record from multiple users with same search condition
- Implemented deleteByID() and updateById() from mongoose
- Data validation implemented using mongoose schema types
