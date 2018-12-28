const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const InstAcc = require("server/models/InstAcc");
const InstTask = require("server/models/InstTask");
const { updateProfileInfo } = require("server/tasks/watchStats");
const { InvalidUserIdError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/inst/update-stats", async function(ctx) {
    const { id, token, username } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const acc = await InstAcc.findOne({ username });

      await updateProfileInfo(acc, username);

      await acc.save();

      ctx.status = 200;

      ctx.body = {
        acc
      };
    } else {
      throw new InvalidUserIdError();
    }
  });
