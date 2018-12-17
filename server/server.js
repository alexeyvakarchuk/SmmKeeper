const axios = require("axios");
const path = require("path");
const fs = require("fs");

// Koa
const Koa = require("koa");
const Router = require("koa-router");
const app = new Koa();
const router = new Router();

const handlers = fs.readdirSync(path.join(__dirname, "handlers")).sort();
handlers.forEach(handler => require("./handlers/" + handler).init(app));

// *** Auth API handlers ***
const authHandlers = fs.readdirSync(path.join(__dirname, "api/auth")).sort();

authHandlers.forEach(handler => require("./api/auth/" + handler).init(router));

// *** Users API handlers ***
const usersHandlers = fs.readdirSync(path.join(__dirname, "api/users")).sort();
usersHandlers.forEach(handler =>
  require("./api/users/" + handler).init(router)
);

// *** Inst API handlers ***
const instHandlers = fs.readdirSync(path.join(__dirname, "api/inst")).sort();
instHandlers.forEach(handler => require("./api/inst/" + handler).init(router));

router.get("/auth/success", async ctx => {
  const filePath = path.join(__dirname, "./templates/googleAuthSuccess.html");

  ctx.status = 200;
  ctx.type = "html";
  ctx.body = fs.createReadStream(filePath);
});

app.use(router.routes());

module.exports = { app, router };
