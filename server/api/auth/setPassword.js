const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const socket = require("server/libs/socket");
const {
  InvalidUserIdError,
  PaswordIsRequiredError,
  PaswordsDoNotMatchError
} = require("server/api/errors");

exports.init = router =>
  router.post("/api/set-password", async function(ctx) {
    const { id, token, password, passwordConfirm } = ctx.request.body;

    if (!password.length || !passwordConfirm.length) {
      throw new PaswordIsRequiredError();
      return;
    }

    if (password !== passwordConfirm) {
      throw new PaswordsDoNotMatchError();
      return;
    }

    if (jwt.verify(token, jwtsecret).id === id) {
      const user = await User.findById(id);

      user.password = password;

      await user.save();

      ctx.status = 200;

      // payload - Info that will be saved into JWT token
      const payload = {
        id: user._id,
        email: user.email,
        createdAt: Date.now()
      };

      const token = jwt.sign(payload, jwtsecret); // Token creation

      socket.emitter.to(id).emit("setPassword", token);
    } else {
      throw new InvalidUserIdError();
    }
  });
