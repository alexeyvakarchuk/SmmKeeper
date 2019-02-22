const passport = require("koa-passport");

const User = require("server/models/User");
const jwt = require("jsonwebtoken");

// Checkes whether JWT token came from client is valid or not

exports.init = router =>
  router.get("/api/check-token", async (ctx, next) => {
    await passport.authenticate("jwt", async (err, user) => {
      if (user) {
        const dbUser = await User.findById(user._id);

        if (dbUser) {
          ctx.status = 200;

          ctx.body = {
            user: {
              id: user._id,
              email: user.email,
              isAdmin: dbUser.isAdmin
            }
          };
        } else {
          ctx.status = 403;
          ctx.body = "Permission denied";
        }
      } else {
        ctx.status = 403;
        ctx.body = "Permission denied";
      }
    })(ctx, next);
  });
