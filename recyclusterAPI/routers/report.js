var passport = require("passport");
require("../auth/auth");
var { verifyRole } = require("../middleware/role");

var {
    getAll,
    getReport,
    getReportsByTarget,
    createReport,
    updateReportStatus,
    deleteReport,
    deleteReports
} = require("../controllers/report");
var express = require("express");
var router = express.Router();

router.get("/all/:page", getAll);
router.get("/:_id", getReport);
router.get("/target/:_id", getReportsByTarget);
// Protected routes
router.post("/", passport.authenticate("jwt", { session: false }), createReport);
router.put("/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin", "admin"]), updateReportStatus);
router.delete("/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin", "admin"]), deleteReport);
// Tmp routes
router.delete("/", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin"]), deleteReports);

module.exports = router;