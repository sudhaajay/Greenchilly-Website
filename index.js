require("dotenv").config();
const path = require("path");
const express = require("express");
const userRoute = require("./route/userRoute");
const adminRoute = require("./route/adminRoute");
const dbConnection = require("./config/dbConnect");
const session = require("express-session");
const nocache = require("nocache")
// const logger = require('morgan');
const app = express();
const port = process.env.PORT || 5050;
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use (nocache());


dbConnection();
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.set("views", "./views");

// Serve the static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/assets")));

app.use(express.static(path.join(__dirname, "public/userassets")));

// Create a simple route
app.use("/", userRoute);
app.use("/admin", adminRoute);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
