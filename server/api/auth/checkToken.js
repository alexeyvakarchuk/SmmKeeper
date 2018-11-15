const passport = require("koa-passport");
const jwt = require("jsonwebtoken");

// Checkes whether JWT token came from client is valid or not

exports.init = router =>
  router.get("/api/check-token", async (ctx, next) => {
    await passport.authenticate("jwt", (err, user) => {
      if (user) {
        ctx.status = 200;

        ctx.body = {
          user: {
            id: user._id,
            email: user.email
          }
        };
      } else {
        ctx.status = 403;
        ctx.body = "Permission denied";
      }
    })(ctx, next);
  });
