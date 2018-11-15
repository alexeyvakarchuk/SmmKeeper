const passport = require("koa-passport");
const LocalStrategy = require("passport-local");
const User = require("server/models/User");

// Стратегия берёт поля из req.body
// Вызывает для них функцию
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // 'username' by default
      passwordField: "password",
      session: false
      // passReqToCallback: true // req for more complex cases
    },
    // Три возможных итога функции
    // done(null, user[, info]) ->
    //   strategy.success(user, info)
    // done(null, false[, info]) ->
    //   strategy.fail(info)
    // done(err) ->
    //   strategy.error(err)

    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user || !user.checkPassword(password)) {
          // don't say whether the user exists
          return done(null, false, {
            message: "Password or email are invalid"
          });
        }

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
