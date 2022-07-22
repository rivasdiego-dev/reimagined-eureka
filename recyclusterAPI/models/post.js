const mongoose = require("mongoose");
const { getObjId } = require("../utils/generalFunctions");

const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    id: {
      type: String
    },
    user_id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 1
    },
    visibility: {
      type: Number,
      default: 1,
    },
    history: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

// Save id as string
PostSchema.pre("save", async function (next) {
  const post = this;
  post.id = getObjId(post._id);
  
  next();
});

const PostModel = mongoose.model("post", PostSchema);

module.exports = PostModel;