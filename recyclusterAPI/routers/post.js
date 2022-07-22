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
    getPost,
    getPostsByUser,
    createPost,
    updatePost,
    changePostVisibility,
    deletePost,
    deletePosts
} = require("../controllers/post");
var express = require("express");
var router = express.Router();

router.get("/allnopagination", getAllNoPagination);
router.get("/all/:page", getAll);
router.get("/:_id", getPost);
router.get("/user/:_id", getPostsByUser);
// Protected routes
router.post("/", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), upload.single('image'), createPost);
router.put("/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), upload.single('image'), updatePost);
router.put("/visibility/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), changePostVisibility);
router.delete("/:_id", passport.authenticate("jwt", { session: false }), verifyRole(["user"]), deletePost);
// Tmp routes
router.delete("/", passport.authenticate("jwt", { session: false }), verifyRole(["superadmin"]), deletePosts);

module.exports = router;