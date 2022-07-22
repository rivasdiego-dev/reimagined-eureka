var passport = require("passport");
require("../auth/auth");
const multer = require('multer');
var { multer_config } = require("../utils/multerConfig");
var { verifyRole } = require("../middleware/role");

// upload images strategy
var upload = multer(multer_config);

var {
    getAllNoPagination,
    getAll,
    getExchange,
    getExchangesByPost,
    getExchangesByUser,
    createExchange,
    completeExchange,
    aproveExchange,
    exampleExchange, // test
    updateExchange,
    likeExchange,
    countExchanges,
    deleteExchange,
    deleteExchanges
} = require("../controllers/exchange");
var express = require("express");
var router = express.Router();

router.get("/allnopagination", getAllNoPagination);
router.get("/all/:page", getAll);
router.get("/:_id", getExchange);
router.get("/post/:_id", getExchangesByPost);
router.get("/user/:_id", getExchangesByUser);
// Protected routes
router.get("/count/all", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin","admin"]), countExchanges);
router.post("/", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), createExchange);
router.put("/complete/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), upload.single('image'), completeExchange);
router.put("/aprove/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), aproveExchange);
router.put("/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), upload.single('image'), updateExchange);
router.put("/like/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), likeExchange);
router.delete("/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), deleteExchange);
// Tmp routes
router.delete("/", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin"]), deleteExchanges);
router.get("/test/:_id", exampleExchange); // TODO: remove test

module.exports = router;