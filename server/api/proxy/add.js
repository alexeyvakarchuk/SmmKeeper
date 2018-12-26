const Proxy = require("server/models/Proxy");
// const { InvalidUserIdError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/proxy/add", async function(ctx) {
    // const { host, port, auth } = ctx.request.body;

    try {
      proxy = await Proxy.create(ctx.request.body);

      ctx.status = 200;
    } catch (e) {
      console.log(e);
      ctx.status = 400;
      ctx.body = "Something went wrong with your proxy";
    }
  });
