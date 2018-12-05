const axios = require("axios");
const config = require("./config/default");
const path = require("path");
const fs = require("fs");
const socket = require("./libs/socket");

// Koa
const Koa = require("koa");
const Router = require("koa-router");
const app = new Koa();
const router = new Router();

// Next
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const n = next({ dev });

// next-routes
const routes = require("./routes");
const handler = routes.getRequestHandler(n);

n.prepare().then(() => {
  // Restarts tasks for all the taskswiths status=1
  require("./tasks/startTasks");
  require("./tasks/watchStats");

  const handlers = fs.readdirSync(path.join(__dirname, "handlers")).sort();
  handlers.forEach(handler => require("./handlers/" + handler).init(app));

  // *** Auth API handlers ***
  const authHandlers = fs.readdirSync(path.join(__dirname, "api/auth")).sort();

  authHandlers.forEach(handler =>
    require("./api/auth/" + handler).init(router)
  );

  // *** Users API handlers ***
  const usersHandlers = fs
    .readdirSync(path.join(__dirname, "api/users"))
    .sort();
  usersHandlers.forEach(handler =>
    require("./api/users/" + handler).init(router)
  );

  // *** Inst API handlers ***
  const instHandlers = fs.readdirSync(path.join(__dirname, "api/inst")).sort();
  instHandlers.forEach(handler =>
    require("./api/inst/" + handler).init(router)
  );

  // router.get("/a", async ctx => {
  //   await app.render(ctx.req, ctx.res, "/b", ctx.query);
  //   ctx.respond = false;
  // });

  // router.get("/b", async ctx => {
  //   await app.render(ctx.req, ctx.res, "/a", ctx.query);
  //   ctx.respond = false;
  // });

  router.get("*", async ctx => {
    await handler(ctx.req, ctx.res);
    ctx.status = 200;
    ctx.respond = false;
  });

  // app.use(async (ctx, next) => {
  //   ctx.res.statusCode = 200;
  //   await next();
  // });

  app.use(router.routes());

  const server = app.listen(config.port, () => {
    console.log(`> Listening on http://localhost:${config.port}`);
  });

  socket(server);
});
