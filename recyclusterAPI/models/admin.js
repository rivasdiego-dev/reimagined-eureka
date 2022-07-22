const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { getObjId } = require("../utils/generalFunctions");

const Schema = mongoose.Schema;
const AdminSchema = new Schema(
  {
    id: {
      type: String
    },
    username: {
      type: String,
      required: true,
      unique: true,
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
    }
  },
  { timestamps: true }
);

// Save id as string
AdminSchema.pre("save", async function (next) {
  const admin = this;
  // Save id as string
  admin.id = getObjId(admin._id);
  // Auto-generate Salt, and 10 salt rounds
  const hash = await bcrypt.hash(admin.password, 10);
  admin.password = hash;
  next();
});

// Helper method to validate password
AdminSchema.methods.isValidPassword = async function (password) {
  const admin = this;
  const compare = await bcrypt.compare(password, admin.password);
  return compare;
};

const AdminModel = mongoose.model("admin", AdminSchema);

module.exports = AdminModel;