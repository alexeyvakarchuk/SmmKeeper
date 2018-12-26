const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const InstAcc = require("server/models/InstAcc");
const InstTask = require("server/models/InstTask");
const Instagram = require("instagram-web-api");
const cron = require("node-cron");
const mf = require("server/tasks/mf");
const {
  InvalidUserIdError,
  InvalidInstAccDataError,
  TaskAlreadyInProgressError
} = require("server/api/errors");
const socket = require("server/libs/socket");
const { resolve } = require("path");
const FileCookieStore = require("tough-cookie-filestore2");
const { getProxyString } = require("server/api/utils");

exports.init = router =>
  router.post("/api/inst/task-start", async function(ctx) {
    const { id, token, username, sourceUsername, type } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const user = await User.findById(id);

      let client;

      try {
        const acc = await InstAcc.findOne({
          userId: user._id,
          username
        }).populate("proxy");

        const { password, proxy } = acc;

        const cookieStore = new FileCookieStore(
          resolve("server", `cookieStore/${username}.json`)
        );

        client = new Instagram(
          { username, password, cookieStore },
          {
            proxy: getProxyString(proxy)
          }
        );

        await client.login();
      } catch (e) {
        console.log(e);
        throw new InvalidInstAccDataError();
      }

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
          mf(username, client);
          break;
      }

      console.log(task);

      socket.emitter.to(id).emit("taskStart", task);

      ctx.status = 200;
    } else {
      throw new InvalidUserIdError();
    }
  });
