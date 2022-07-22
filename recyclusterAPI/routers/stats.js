var passport = require("passport");
require("../auth/auth");
var { verifyRole } = require("../middleware/role");

var {
    getAll
} = require("../controllers/stats");
var express = require("express");
var router = express.Router();

// Protected routes
router.get("/", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin", "admin"]), getAll);

module.exports = router;