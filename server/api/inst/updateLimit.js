const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const InstAcc = require("server/models/InstAcc");
const socket = require("server/libs/socket");
const {
  InvalidUserIdError,
  InvalidInstAccDataError
} = require("server/api/errors");

exports.init = router =>
  router.post("/api/inst/update-limit", async function(ctx) {
    const { id, token, username, type, limitValue } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const user = await User.findById(id);

      const accs = await InstAcc.find({ userId: user._id });

      let acc = await InstAcc.findOne({ userId: user._id, username });

      if (!acc) {
        throw new InvalidInstAccDataError();
      }

      // TODO: add check for value < max && value > min
      acc.limits[type].current = limitValue;

      await acc.save();

      socket.emitter.to(id).emit("updateLimit", {
        username,
        type,
        limitValue
      });

      ctx.status = 200;
    } else {
      throw new InvalidUserIdError();
    }
  });
