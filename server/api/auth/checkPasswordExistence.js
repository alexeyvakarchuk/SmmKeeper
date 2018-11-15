const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const socket = require("server/libs/socket");
const { InvalidUserIdError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/check-password-existence", async function(ctx) {
    const { id, token } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const user = await User.findById(id);

      if (user.passwordHash) {
        ctx.status = 200;
        ctx.body = {
          passwordExist: true
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          passwordExist: false
        };
      }
    } else {
      throw new InvalidUserIdError();
    }
  });
