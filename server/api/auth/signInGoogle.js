const passport = require("koa-passport");
const User = require("server/models/User");
const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing

exports.init = router => {
  let authResolve = () => {};
  let authReject = () => {};

  router.post("/api/sign-in/google/check", async (ctx, next) => {
    try {
      const response = await new Promise((resolve, reject) => {
        authResolve = resolve;
        authReject = reject;
      });

      ctx.status = 200;

      ctx.body = response;
    } catch (e) {
      console.log(e);
      ctx.status = 401;
      ctx.body = {
        error: {
          message: "Auth error. Try again with email and password, please!"
        }
      };
    }
  });

  router.get(
    "/api/sign-in/google",
    passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ],
      display: "popup",
      session: false
    })
  );

  router.get(
    "/api/sign-in/google/redirect",
    async (ctx, next) => {
      await passport.authenticate("google", async (err, user) => {
        console.log(" err:: ", err, " user:: ", user);
        if (!user) {
          console.log(user);
          authReject();
          ctx.status = 401;
          ctx.body = {
            error: {
              message: "Auth error. Try again, please!"
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

          // ctx.cookies.set("tktoken", token);

          authResolve({
            user: {
              email: user.email,
              id: user._id,
              isAdmin: user.isAdmin
            },
            token
          });

          ctx.status = 200;

          ctx.redirect("/auth/success");
        }
      })(ctx, next);
    }
    // passport.authenticate("google", {
    //   successRedirect: "/auth/success",
    //   failureRedirect: "/login",
    //   session: false
    // }),
    // (ctx, next) => {
    //   ctx.body = "adasd";
    // }
  );
};
