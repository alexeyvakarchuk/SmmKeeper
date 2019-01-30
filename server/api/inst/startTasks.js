const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signin
const socket = require("server/libs/socket");
const mf = require("server/tasks/mf");
const uf = require("server/tasks/uf");
const InstTask = require("server/models/InstTask");
const { asyncForEach } = require("server/api/utils");
const { InvalidUserIdError } = require("server/api/errors");
const { getInstaClient } = require("server/api/utils");

exports.init = (router, clientStore) =>
  router.post("/api/inst/tasks-start", async function(ctx) {
    const { id, token, username, tasks } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const client = await getInstaClient(id, username, clientStore);

      let res = [];

      await asyncForEach(tasks, async taskId => {
        const task = await InstTask.findById(taskId);

        if (task && task.status !== 1) {
          switch (task.type) {
            case "mf":
              mf(username, taskId, client);
              break;

            case "uf":
              uf(username, taskId, client);
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
