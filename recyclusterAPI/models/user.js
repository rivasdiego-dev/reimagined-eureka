const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { getObjId } = require("../utils/generalFunctions");

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    id: {
      type: String
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    points: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
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

// Always encrypt the password before save
UserSchema.pre("save", async function (next) {
  const user = this;
  // Save id as string
  user.id = getObjId(user._id);
  // Auto-generate Salt, and 10 salt rounds
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

// UserSchema.post

// Helper method to validate password
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;