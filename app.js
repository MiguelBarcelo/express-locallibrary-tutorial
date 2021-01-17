const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// Use gzip/deflate compression for responses
const compression = require("compression");

// To protect against well know vulnerabilities
const helmet = require("helmet");

// Enviroment
const dotenv = require("dotenv");
dotenv.config();

// require modules from our routes directory
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");

// Create the app object
const app = express();

// When the app starts, chain middleware helment
app.use(helmet());

// Set up mongoose connection
//const dev_db_url = "mongodb+srv://mb08:qazqsx@cluster0.xdb5y.mongodb.net/local_library?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// add middleware into the request handling chain
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// this should before any routes you want compresses - in this case, all of them!
app.use(compression());

app.use(express.static(path.join(__dirname, "public")));

// Add our route-handling code to the request handling chain
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
