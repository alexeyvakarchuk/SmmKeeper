const User = require("server/models/User");
const pick = require("lodash/pick");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const { UserExistsError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/sign-up", async function(ctx) {
    const { email, password } = ctx.request.body;

    // When we register user via form then password is required
    if (validator.validate(email) && !password.length) {
      ctx.status = 400;
      ctx.body = {
        error: {
          message: "Password is required"
        }
      };
    } else {
      let user;

      // Checks if there already registered user via social network for this email
      // If yes - we'll just bind the password to his model
      const connectedUser = await User.findOne({
        email,
        passwordHash: {
          $exists: false
        }
      });

      if (connectedUser) {
        connectedUser.password = password;
        await connectedUser.save();
        user = connectedUser;
      } else {
        try {
          user = await User.create(ctx.request.body);
        } catch (e) {
          if (e.name === "ValidationError") {
            throw new UserExistsError();
          }
        }
      }

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
          email: user.email
        },
        token
      };
    }
  });
