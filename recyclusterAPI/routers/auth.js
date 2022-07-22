var express = require("express");
var jwt = require("jsonwebtoken");
var AdminModel = require("../models/admin");
var UserModel = require("../models/user");
var router = express.Router();

// Blocked flag
const BLOCKED = 2;

router.post("/login", async (req, res, next) => {
  try {
    // username used to allow 
    // the user to access using its email or username
    let { username, password } = req.body;

    let user = await UserModel.findOne({ $or: [ {email: username}, {username: username} ] });
    if (!user)
      return res.status(400).send({
        ok: false,
        message: "User not found",
      });

    if (user.status === BLOCKED) 
      return res.status(400).send({
        ok: false,
        message: "User has been blocked",
      });

    let validPassword = await user.isValidPassword(password);
    if (!validPassword)
      return res.status(400).send({
        ok: false,
        message: "Wrong password",
      });

    let body = { _id: user._id, role: user.role };
    let token = jwt.sign(
      { user: body },
      process.env.JWT_SECRET || "TOP_SECRET_R"
    );

    user.password = null

    return res.json({ 
      ok: true,
      token: token,
      user
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login/admin", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    let admin = await AdminModel.findOne({ username });
    if (!admin)
      return res.status(400).send({
        ok: false,
        message: "Admin not found",
      });

    let validPassword = await admin.isValidPassword(password);
    if (!validPassword)
      return res.status(400).send({
        ok: false,
        message: "Wrong password",
      });

    let body = { _id: admin._id, role: admin.role };
    let token = jwt.sign(
      { user: body },
      process.env.JWT_SECRET || "TOP_SECRET_R"
    );

    return res.json({ 
      ok: true,
      token: token 
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;