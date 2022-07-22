var passport = require("passport");
require("../auth/auth");
var { verifyRole } = require("../middleware/role");

var {
    getAllAdmins,
    createAdmin,
    updateAdmin,
    restorePassword,
    updateUserStatus,
    updatePostStatus,
    deleteAdmins
} = require("../controllers/admin");
var express = require("express");
var router = express.Router();

router.get("/restore/:username", restorePassword);
// Protected routes
router.get("/", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin", "admin"]), getAllAdmins);
router.post("/", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin"]), createAdmin);
router.put("/:username", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin", "admin"]), updateAdmin);
router.put("/user/status/:username", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin", "admin"]), updateUserStatus);
router.put("/post/status/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin", "admin"]), updatePostStatus);
// Tmp routes
router.delete("/", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin"]), deleteAdmins);

module.exports = router;