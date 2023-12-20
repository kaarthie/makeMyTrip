const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const flightRouter = require('../routes/flightRoutes.js')
const authRouter = require('../routes/authRoutes.js');
const app = express();
// middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json())
app.use(authRouter);
app.use(flightRouter);
// Server and Database Connection

app.get('/home' , (req , res) => {
  console.log(req);
  res.send("Homeyyyy");
})
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

