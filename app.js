const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const router = require('./routes/routes.js')
const app = express();
// middlewares
app.use(express.json())
app.use(router);
app.use(cors);

// Server and Database Connection
const port = 3999;
function server(){
        mongoose.connect('mongodb+srv://karthi:karthi2001@first.ixg5wi3.mongodb.net/mmt')
        .then(() => {
          console.log("Database Connected");
          app.listen(port ,(err) => {
            if(!err){
              console.log("Server listening to the port ",port);
            }
            else throw new Error("Hosting error");
          })
        })
        .catch((err) => {
          console.log("DB Error , ",err);
        })
  }
server();

