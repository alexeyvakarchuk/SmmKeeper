const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const InstAcc = require("server/models/InstAcc");
const InstTask = require("server/models/InstTask");
const { InvalidUserIdError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/inst/fetch-tasks", async function(ctx) {
    const { id, token, username } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const acc = await InstAcc.findOne({ username });

      const tasks = await InstTask.find(
        {
          username
        },
        "-_id -__v -end_cursor"
      );

      ctx.status = 200;

      ctx.body = {
        tasksList: tasks.length ? tasks : []
      };
    } else {
      throw new InvalidUserIdError();
    }
  });
