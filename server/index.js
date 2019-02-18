const { app, router } = require("./server.js");
const path = require("path");
const config = require("./config/default");
const socket = require("./libs/socket");

// Next
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const n = next({ dev });

// next-routes
const routes = require("./routes");
const handler = routes.getRequestHandler(n);

n.prepare().then(() => {
  // require("./dbQueries/addProfileId");
  // require("./dbQueries/updateTaskProfileId");

  // Restarts tasks for all the tasks withs status=1
  require("./tasks/startTasks");
  require("./tasks/watchStats");

  router.get("/service-worker.js", async ctx => {
    const filePath = path.join(__dirname, "../.next", "/service-worker.js");
    console.log(filePath);
    n.serveStatic(ctx.req, ctx.res, filePath);
    ctx.status = 200;
    ctx.respond = false;
  });

  router.get("*", async ctx => {
    await handler(ctx.req, ctx.res);
    ctx.status = 200;
    ctx.respond = false;
  });

  const server = app.listen(config.port, () => {
    console.log(`> Listening on port : ${config.port}`);
  });

  socket(server);
});

module.exports = app;
