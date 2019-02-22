const passport = require("koa-passport");
const User = require("server/models/User");
const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing

exports.init = router =>
  router.post("/api/sign-in", async (ctx, next) => {
    // ctx.cookies.set("tktoken", "", { expires: 0 });
    // console.log("removed cookie");
    await passport.authenticate("local", async (err, user) => {
      if (!user) {
        ctx.status = 400;
        ctx.body = {
          error: {
            message: "Password or email are invalid"
          }
        };
      } else {
        // payload - Info that will be saved into JWT token
        const payload = {
          id: user._id,
          email: user.email,
          createdAt: Date.now()
        };

        const token = jwt.sign(payload, jwtsecret); // Token creation

        ctx.status = 200;

        ctx.body = {
          user: {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
          },
          token
        };
      }
    })(ctx, next);
  });
