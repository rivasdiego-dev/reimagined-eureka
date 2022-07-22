var passport = require("passport");
require("../auth/auth");
var { verifyRole } = require("../middleware/role");

var {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    changeUserVisibility,
    restorePassword,
    countUsers,
    deleteUser,
    deleteUsers
} = require("../controllers/user");
var express = require("express");
var router = express.Router();

router.get("/:username", getUser);
router.post("/", createUser);
router.get("/restore/:email", restorePassword);
// Protected routes
router.get("/all/:page", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin", "admin"]), getAllUsers);
router.get("/count/all", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin", "admin"]), countUsers);

router.put("/:username", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), updateUser);
router.put("/visibility/:username", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), changeUserVisibility);
router.delete("/:username", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), deleteUser);
// Tmp routes
router.delete("/", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin"]), deleteUsers);

module.exports = router;