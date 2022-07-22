const mongoose = require("mongoose");
var debug = require('debug')('recycluster:server');

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/recycluster")
  .then(
    () => {
      // debug("Database connected");
      console.log("Database connected ");
    },
    (err) => {
      // debug("Error to connect to database %o", err);
      console.log("Error to connect to database %o", err);
    }
  );