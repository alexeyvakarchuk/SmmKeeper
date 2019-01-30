const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const InstAcc = require("server/models/InstAcc");
const InstTask = require("server/models/InstTask");
const cron = require("node-cron");
const mf = require("server/tasks/mf");
const uf = require("server/tasks/uf");
const {
  InvalidUserIdError,
  TaskAlreadyInProgressError,
  RateLimitedError,
  FollowsLimitExceededError,
  PasswordWasChangedError
} = require("server/api/errors");
const socket = require("server/libs/socket");
const { asyncForEach } = require("server/api/utils");
const { getInstaClient } = require("server/api/utils");

exports.init = (router, clientStore) =>
  router.post("/api/inst/task-create", async function(ctx) {
    const { id, token, username, type, sourceUsername } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const user = await User.findById(id);

      const acc = await InstAcc.findOne({
        userId: user._id,
        username
      }).populate("proxy");

      if (acc.status === "RateLimited") {
        throw new RateLimitedError();
      } else if (acc.status === "FollowsLimitExceeded" && type === "mf") {
        throw new FollowsLimitExceededError();
      } else if (acc.status === "PasswordWasChanged") {
        throw new PasswordWasChangedError();
      }

      const client = await getInstaClient(id, username, clientStore);

      // await asyncForEach(tasks, async ({ type, sourceUsername }) => {
      const { id: sourceId } = await client.getUserByUsername({
        username: sourceUsername
      });

      let task = await InstTask.findOne({
        username,
        sourceUsername,
        sourceId,
        type
      });

      // If such task was already created we'll not duplicate it
      if (task) {
        // If task status was set to 1 we'll not continue, because the task is already in progress
        if (!task.status) {
          task.status = 1;

          await task.save();
        } else {
          throw new TaskAlreadyInProgressError();
        }
      } else {
        task = await InstTask.create({
          username,
          sourceUsername,
          sourceId,
          type,
          status: 1
        });
      }

      switch (type) {
        case "mf":
          mf(username, task._id, client);
          break;

        case "uf":
          uf(username, task._id, client);
          break;
      }

      console.log(task);

      socket.emitter.to(id).emit("taskStart", task);

      ctx.status = 200;
    } else {
      throw new InvalidUserIdError();
    }
  });
