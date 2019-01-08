const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const InstTask = require("server/models/InstTask");
const socket = require("server/libs/socket");
const { InvalidUserIdError } = require("server/api/errors");
const { asyncForEach } = require("server/api/utils");

exports.init = router =>
  router.post("/api/inst/tasks-pause", async function(ctx) {
    console.log(ctx.request.body);
    const { id, token, username, tasks } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const user = await User.findById(id);

      let res = [];

      await asyncForEach(tasks, async taskId => {
        const task = await InstTask.findById(taskId);

        if (task && task.status !== 0) {
          task.status = 0;

          await task.save();

          res.push(task._id);
        }
      });

      socket.emitter.to(id).emit("tasksPause", res);

      ctx.status = 200;
    } else {
      throw new InvalidUserIdError();
    }
  });
