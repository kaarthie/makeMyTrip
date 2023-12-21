const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const flightRouter = require('../routes/flightRoutes.js')
const authRouter = require('../routes/authRoutes.js');
const profileRouter = require('../routes/profileRoutes.js')
const app = express();
// middlewares
app.use(cors({ origin: '*', credentials: true }));

app.use(express.json())

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  next();
});

// Router Middlewares
app.use(authRouter);
app.use(flightRouter);
app.use(profileRouter);
// Server and Database Connection
const port = 3000;
function server() {
  mongoose
    .connect('mongodb+srv://karthi:karthi2001@first.ixg5wi3.mongodb.net/mmt')
    .then(() => {
      console.log("Database Connected");
      app.listen(port,(err) => {
        if (!err) {
          console.log("Server listening to the port ", port);
        } else {
          throw new Error("Hosting error");
        }
      });
    })
    .catch((err) => {
      console.log("DB Error , ", err);
    });
}

server();

