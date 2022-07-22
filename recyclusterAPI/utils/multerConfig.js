const multer = require('multer');
const { image_formats } = require("../utils/imageRequirements");

// upload images strategy
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/' + req.user._id.toString().replace(/ObjectId\("(.*)"\)/, "$1"))
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (image_formats.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

exports.multer_config = { 
    storage: storage,
    limits: { 
        fileSize: 1024 * 1024 * 5  // 5Mb
    },
    fileFilter: fileFilter
};