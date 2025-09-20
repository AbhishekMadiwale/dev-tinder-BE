- We can use nodemon which will automatically refresh the server whenever we make any changes
- we don't need to manually close and start the server again and again

- we need to import express from express to create a server

  - import express = require("express");

- now we are creating a server naming app using express

  - const app = express()

- to access this server we need to use listen(port) method with portnumber in parenthesis, like

  - app.listen(3001);

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
