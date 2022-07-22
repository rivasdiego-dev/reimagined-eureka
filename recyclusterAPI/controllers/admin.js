const AdminModel = require("../models/admin");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const {  changeUserStatus } = require("./user");
const {  changePostStatus } = require("./post");

const validatePassword = (password) => {
  return String(password)
    .match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    );
}

const getObjId = (id) => {
  return id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
}

const generatePassword = () => {
  return crypto.randomBytes(12).toString('hex');
}

exports.getAllAdmins = async (req, res, next) => {
  // No pagination needed since there will be few admins
  try {
    let admins = await AdminModel.find({}, "-password");
    res.send({
      ok: true,
      count: admins.length,
      admins,
    });
  } catch (err) {
    next(err);
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username)
      return res.status(400).send({ok: false, message: "Username is required"});

    if (!validatePassword(password))
      return res.status(400).send({
        ok: false,
        message: "Invalid password format",
        requirements: [
          "At least 8 characters",
          "Must contain at least 1 uppercase letter",
          "1 lowercase letter, and 1 number",
          "Can contain special characters"
        ]
      });

    let newAdmin = await AdminModel.create({
      username,
      password,
      role: "admin"
    });

    newAdmin.password = null;

    res.send({ 
      ok: true,
      admin: newAdmin 
    });
  } catch (err) {
    next(err);
  }
};

exports.createSuperAdmin = async () => {
  try {
    let exists = await AdminModel.findOne({ username: "superadmin" });

    if (exists) return;

    let admin = await AdminModel.create({
      username: "superadmin",
      password: "recycluster$$",
      role: "superadmin"
    });

    console.log("Super admin created");
  } catch (err) {
    console.log("Error creating super admin");
  }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    let usernameToUpdate = req.params.username;
    let { username, password } = req.body;

    let admin = await AdminModel.findOne({ username: usernameToUpdate }, "-password");

    if (!admin)
      return res.status(404).send({
        ok: false,
        message: "Admin to update not found",
      });

    // Verify admins ownership
    if (getObjId(req.user._id) !== getObjId(admin._id)) {
      return res.status(400).send({
          ok: false,
          message: "You cannot update someones elses user",
      });
    }
    
    if (!username)
      res.status(400).send({ok: false, message: "Username is required"});

    if (!validatePassword(password))
      return res.status(400).send({
        ok: false,
        message: "Invalid password format",
        requirements: [
          "At least 8 characters",
          "Must contain at least 1 uppercase letter",
          "1 lowercase letter, and 1 number",
          "Can contain special characters"
        ]
      });

    // new hash password
    const hash = await bcrypt.hash(password, 10);

    let updated = await AdminModel.updateOne(
      { username: usernameToUpdate },
      {
        username,
        password: hash
      }
    );

    // get updated user from DB
    admin = await AdminModel.findOne({ username }, "-password");

    if (updated.acknowledged && admin) {
      return res.send({
        ok: true,
        message: "User is updated",
        admin: admin,
        info: updated
      });
    }

    res.status(400).send({
      ok: false,
      message: "cannot update the admin",
    });
  } catch (err) {
    next(err);
  }
};

exports.restorePassword = async (req, res, next) => {
  // TODO: this method should send an email to the admin
  try {
    let username = req.params.username;
    let admin = await AdminModel.findOne({ username }, "-password");

    if (!admin)
      return res.status(400).send({
        ok: false,
        message: "Admin to restore not found",
      });
  
    // new password
    let pass = generatePassword();
    // new hash password
    const hash = await bcrypt.hash(pass, 10);

    let updated = await AdminModel.updateOne(
      { username },
      { password: hash }
    );

    if (updated.acknowledged && admin) {
      return res.send({
        ok: true,
        message: "New temporary password created",
        newPassword: pass,
        info: updated
      });
    }
  } catch (err) {
    next(err);
  }
};

// Block and unblock users
exports.updateUserStatus = async (req, res, next) => {
  try {
      let username = req.params.username;

      let response = await changeUserStatus(username);

      if (response.ok) {
        return res.status(200).send(response); 
      } else {
        return res.status(400).send(response); 
      }
  } catch (err) {
      next(err);
  }
};

// Block and unblock posts
exports.updatePostStatus = async (req, res, next) => {
  try {
      let _id = req.params._id;

      let response = await changePostStatus(_id);

      if (response.ok) {
        return res.status(200).send(response); 
      } else {
        return res.status(400).send(response); 
      }
  } catch (err) {
      next(err);
  }
};

exports.deleteAdmins = async (req, res, next) => {
  // TODO: This method will not be published since we are not deleting users
  // METHOD id temporary to dev porpouses
  try {

    let deleted = await AdminModel.deleteMany({ role: "admin" });

    if (deleted) {
      return res.send({
        ok: true,
        deleted: deleted,
        message: "successfully deleted",
      });
    }

    return res.status(400).send({
      ok: false,
      message: "cannot delete the users",
    });
  } catch (err) {
    next(err);
  }
};