const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const fs = require('fs');

const { sendEmailToUser } = require("../controllers/mailer");
const { getObjId } = require("../utils/generalFunctions");
const { USER_OMIT } = require('../utils/ommit');

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePassword = (password) => {
  return String(password)
    .match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    );
}

const validatePhone = (phone) => {
  return String(phone)
    .match(
      /^[1-9]{4}-[1-9]{4}$/
    );
}

const createFolder = (id) => {
  if (!fs.existsSync('./public/uploads/' + id)){
    fs.mkdirSync('./public/uploads/' + id);
  }
}

const generatePassword = () => {
  return crypto.randomBytes(12).toString('hex');
}

// PAGINATION
const p_limit = 10;

// FLAGS
const VISIBLE = 1;
const HIDDEN = 2;

const UNBLOCKED = 1;
const BLOCKED = 2;

const startPoints = 500;

exports.getAllUsers = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page ?? 1);
    let p_number = (p_limit * page) - p_limit;

    let searchParams = { status: UNBLOCKED };

    let total = await UserModel.count(searchParams);
    let totalPages = Math.ceil(total / p_limit);

    let users = await UserModel.find(searchParams, USER_OMIT).skip(p_number).limit(p_limit);

    res.send({
      ok: true,
      page: page,
      pages: totalPages,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let username = req.params.username;
    let user = await UserModel.findOne({ username }, USER_OMIT);

    if (!user) {
      return res.status(404).send({
        ok: false,
        message: "user not found",
      });
    }

    res.send({ 
      ok: true,
      user: user 
    });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    let { username, email, phone, password } = req.body;

    if (!username)
      return res.status(400).send({ok: false, message: "Username is required"});

    if (!validateEmail(email))
      return res.status(400).send({
        ok: false,
        message: "Invalid emai address"
      });

    if (!validatePhone(phone))
      return res.status(400).send({
        ok: false,
        message: "Invalid phone number",
        requirements: [
          "format: 2257-7777"
        ]
      });

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

    let newUser = await UserModel.create({
      username,
      email: email.toLowerCase(),
      phone,
      password,
      points: startPoints,
      role: "user"
    });

    createFolder(getObjId(newUser._id));
    newUser.password = null;

    res.send({ 
      ok: true,
      user: newUser 
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let usernameToUpdate = req.params.username;

    // New data
    let { username, email, phone, password } = req.body;
    let user = await UserModel.findOne({ username: usernameToUpdate }, USER_OMIT);

    if (!user)
      return res.status(404).send({
        ok: false,
        message: "User to update not found",
      });

    // Verify users ownership
    if (getObjId(req.user._id) !== getObjId(user._id)) {
      return res.status(400).send({
          ok: false,
          message: "You cannot update someones elses user",
      });
    }
    
    if (!username)
      res.status(400).send({ok: false, message: "Username is required"});

    if (!validateEmail(email))
      return res.status(400).send({
        ok: false,
        message: "Invalid email address"
      });

    if (!validatePhone(phone))
      return res.status(400).send({
        ok: false,
        message: "Invalid phone number",
        requirements: [
          "format: 2257-7777"
        ]
      });

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

    let oldUser = { 
      username: user.username,
      email: user.email,
      phone: user.phone,
      points: user.points 
    };

    // new hash password
    const hash = await bcrypt.hash(password, 10);
    // add old user to history
    let newHistory = [ ...user.history, oldUser ];

    let updated = await UserModel.updateOne(
      { username: usernameToUpdate },
      {
        username,
        email: email.toLowerCase(),
        phone,
        password: hash,
        history: newHistory
      }
    );

    // get updated user from DB
    user = await UserModel.findOne({ username }, USER_OMIT);

    if (updated.acknowledged && user) {
      return res.send({
        ok: true,
        message: "User is updated",
        user: user,
        info: updated
      });
    }

    res.send({
      ok: false,
      message: "cannot update the user",
    });
  } catch (err) {
    next(err);
  }
};

// Function call only by the system
// So it will not be access from routes
exports.updateUserPoints = async (user_id, points) => {
  try {
    let user = await UserModel.findOne({ _id: user_id }, USER_OMIT);
  
    if (!user)
      return {
        ok: false,
        message: "User to update not found",
      };
  
    if(!Number.isInteger(points))
      return {
        ok: false,
        message: "Points value must be a integer number",
      };

    let oldUser = { 
      username: user.username,
      email: user.email,
      phone: user.phone,
      points: user.points 
    };

    let newHistory = [ ...user.history, oldUser ];
  
    let updated = await UserModel.updateOne(
      { _id: user_id },
      {
        points: (user.points + points),
        history: newHistory
      }
    );
  
    if (updated.acknowledged) {
      return {
        ok: true,
        message: "Points updated"
      };
    }
  } catch (err) {
    return {
      ok: false,
      message: "Something went wrong",
    };
  }
};


exports.changeUserVisibility = async (req, res, next) => {
  try {
      let username = req.params.username;

      let user = await UserModel.findOne({ username });

      if (!user)
          return res.status(404).send({
              ok: false,
              message: "User to update not found",
          });

      // Verify user ownership
      if (getObjId(req.user._id) !== getObjId(user._id)) {
          return res.status(400).send({
              ok: false,
              message: "This user is not from your ownership",
          });
      }

      // Change visibility
      visibility = (user.visibility == VISIBLE) ? HIDDEN : VISIBLE; 

      let updated = await UserModel.updateOne(
          { username },
          { visibility }
      );

      if (updated.acknowledged) {
          return res.send({
            ok: true,
            message: "User is visibility updated",
            visibility: visibility,
            info: updated
          });
      }
    
      res.status(400).send({
          ok: false,
          message: "cannot update user visibility",
      });
  } catch (err) {
      next(err);
  }
};

// Function used by admins to block users
exports.changeUserStatus = async (username) => {
  try {
      let user = await UserModel.findOne({ username });

      if (!user)
          return {
              ok: false,
              message: "User to update not found",
          };

      // Change status
      newStatus = (user.status == UNBLOCKED) ? BLOCKED : UNBLOCKED; 

      let updated = await UserModel.updateOne(
          { username },
          { status: newStatus }
      );

      if (updated.acknowledged) {
          return {
            ok: true,
            message: "User status updated",
            newStatus: newStatus,
            info: updated
          };
      }
    
      return {
          ok: false,
          message: "cannot update user visibility",
      };
  } catch (err) {
      return {
          ok: false,
          message: "Something went wrong",
      };
  }
};

exports.restorePassword = async (req, res, next) => {
  // TODO: this method should send an email to the user
  // This method should only be used with the email for security
  try {
    let email = req.params.email;
    let user = await UserModel.findOne({ email }, USER_OMIT);

    if (!user)
      return res.status(400).send({
        ok: false,
        message: "User to restore not found",
      });
  
    // new password
    let pass = generatePassword();
    // new hash password
    const hash = await bcrypt.hash(pass, 10);

    let updated = await UserModel.updateOne(
      { email },
      { password: hash }
    );

    if (updated.acknowledged && user) {
      // Sending email with new password
      await sendEmailToUser("eduarmercado4@gmail.com", pass);

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

exports.countUsers = async (req, res, next) => {
  try {
    let countUsers = await UserModel.count({});

    res.send({ 
      ok: true,
      count: countUsers 
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  // TODO: This method will not be published like this since we are not deleting users
  try {
    let username = req.params.username;

    let user = await UserModel.findOne({ username });

    if (!user) 
        return res.status(404).send({
            ok: false,
            message: "No user found"
        });

    // Verify users ownership
    if (getObjId(req.user._id) !== getObjId(user._id)) {
      return res.status(400).send({
          ok: false,
          message: "You cannot delete someones elses user",
      });
    }

    let { deletedCount } = await UserModel.deleteOne({ username });
    if (deletedCount == 1) {
      return res.send({
        ok: true,
        message: "successfully deleted",
      });
    }

    return res.status(400).send({
      ok: false,
      message: "cannot delete the user, maybe it was before",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUsers = async (req, res, next) => {
  // TODO: This method will not be published since we are not deleting users
  // METHOD id temporary to dev porpouses
  try {

    let deleted = await UserModel.deleteMany({ });

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