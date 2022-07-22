var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
var passport = require("passport");

require("./utils/createUploadFolder");
// require("./auth/auth");
require("./database/config");
require("./utils/createSuperAdmin");
var userRouter = require("./routers/user");
var postRouter = require("./routers/post");
var reportRouter = require("./routers/report");
var exchangeRouter = require("./routers/exchange");
var authRouter = require("./routers/auth");
var statsRouter = require("./routers/stats");
var adminRouter = require("./routers/admin");
const errorHandler = require("./utils/errorHandler");

var app = express();

app.use(logger("dev"));
app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// ROUTES
app.use(authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/reports", reportRouter);
app.use("/exchanges", exchangeRouter);
app.use("/stats", statsRouter);
app.use("/admin", adminRouter);

// Error handler
app.use(errorHandler);

module.exports = app;