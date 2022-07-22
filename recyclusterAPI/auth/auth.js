const passport = require("passport");
const UserModel = require("../models/user");
const AdminModel = require("../models/admin");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET || "TOP_SECRET_R",
      jwtFromRequest: ExtractJWT.fromExtractors([
        ExtractJWT.fromAuthHeaderAsBearerToken(),
      ]),
    },
    async (token, done) => {
      try {
        var user = "";

        if (token.user.role === "user") {
          user = await UserModel.findOne(
            { _id: token.user._id },
            "-password"
          );
          
        } else {
          user = await AdminModel.findOne(
            { _id: token.user._id },
            "-password"
          );
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);