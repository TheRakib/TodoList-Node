const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/todoRoutes.js");
require("dotenv").config();
const app = express();
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/", router);

mongoose.set("useFindAndModify", false);
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    // fånga err med if innan man kopplas vidare till appen
    console.log("Connected to my database");
    app.listen(8000, () => {
      console.log("Server started on 8000");
    });
  }
);
