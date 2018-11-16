const jwt = require("jsonwebtoken");
const passport = require("koa-passport");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const socket = require("server/libs/socket");
const { UserExistsError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/update-password", async (ctx, next) => {
    await passport.authenticate("local", async (err, user) => {
      if (!user) {
        ctx.status = 400;

        if (ctx.request.body.email) {
          ctx.body = {
            error: {
              message: "Current password is invalid"
            }
          };
        } else {
          ctx.body = {
            error: {
              message: "Email is required"
            }
          };
        }
      } else {
        const {
          id,
          token,
          password,
          newPassword,
          newPasswordConfirm
        } = ctx.request.body;

        if (!newPassword.length || !newPasswordConfirm.length) {
          throw new PaswordIsRequiredError();
          return;
        }

        if (newPassword !== newPasswordConfirm) {
          throw new PaswordsDoNotMatchError();
          return;
        }

        if (password === newPassword) {
          ctx.status = 400;
          ctx.body = {
            error: {
              message: "New password must be different from the old one"
            }
          };

          return;
        }

        if (jwt.verify(token, jwtsecret).id === id) {
          user.password = newPassword;

          await user.save();

          ctx.status = 200;

          // payload - Info that will be saved into JWT token
          const payload = {
            id: user._id,
            email: user.email,
            createdAt: Date.now()
          };

          const token = jwt.sign(payload, jwtsecret); // Token creation

          socket.emitter.to(id).emit("signOut");

          ctx.body = { token };
        } else {
          throw new InvalidUserIdError();
        }
      }
    })(ctx, next);
  });
