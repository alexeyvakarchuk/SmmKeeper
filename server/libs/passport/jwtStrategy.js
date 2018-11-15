const passport = require("koa-passport");
const JwtStrategy = require("passport-jwt").Strategy; // авторизация через JWT
const ExtractJwt = require("passport-jwt").ExtractJwt; // авторизация через JWT
const jwt = require("jsonwebtoken"); // аутентификация по JWT для hhtp
const { jwtsecret } = require("server/config/default"); // ключ для подписи JWT
const User = require("server/models/User");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: jwtsecret
};

passport.use(
  new JwtStrategy(jwtOptions, async ({ email, createdAt }, done) => {
    try {
      const user = await User.findOne({ email });

      if (user) {
        console.log(createdAt, user.passwordUpdateDate);

        if (createdAt && user.passwordUpdateDate) {
          if (createdAt >= user.passwordUpdateDate) {
            done(null, user);
          } else {
            done(null, false);
          }
        } else {
          done(null, user);
        }
      } else {
        done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  })
);
