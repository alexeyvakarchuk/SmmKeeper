const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signin
const socket = require("server/libs/socket");
const { resolve } = require("path");
const Instagram = require("instagram-web-api");
const mf = require("server/tasks/mf");
const User = require("server/models/User");
const InstTask = require("server/models/InstTask");
const InstAcc = require("server/models/InstAcc");
const FileCookieStore = require("tough-cookie-filestore2");
const { asyncForEach, getProxyString } = require("server/api/utils");
const {
  InvalidUserIdError,
  InvalidInstAccDataError
} = require("server/api/errors");

exports.init = router =>
  router.post("/api/inst/tasks-start", async function(ctx) {
    const { id, token, username, tasks } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const user = await User.findById(id);

      const res = [];

      let client;

      try {
        const acc = await InstAcc.findOne({ username }).populate("proxy");

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

      await asyncForEach(tasks, async taskId => {
        const task = await InstTask.findById(taskId);

        if (task && task.status !== 1) {
          switch (task.type) {
            case "mf":
              mf(username, taskId, client);
              break;
            default:
              console.log(`Task type ${task.type} is not defined`);
              return false;
          }

          task.status = 1;

          await task.save();

          res.push(task._id);
        }
      });

      socket.emitter.to(id).emit("tasksStart", res);

      ctx.status = 200;
    } else {
      throw new InvalidUserIdError();
    }
  });
