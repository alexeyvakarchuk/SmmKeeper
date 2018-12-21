const Proxy = require("server/models/Proxy");
// const { InvalidUserIdError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/proxy/add", async function(ctx) {
    const { host, port } = ctx.request.body;

    proxy = await Proxy.create(ctx.request.body);

    ctx.status = 200;
  });
