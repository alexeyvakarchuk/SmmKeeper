const User = require("server/models/User");

exports.init = router => {
  router.get("/api/users", async function(ctx) {
    try {
      const users = await User.find({});

      ctx.status = 200;
      ctx.body = {
        users: users.map(({ email, _id }) => ({ id: _id, email }))
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        error
      };
    }
  });

  router.get("/api/users/:id", async function(ctx) {
    const { _id, email } = await User.findOne({ _id: ctx.params.id });

    ctx.status = 200;
    ctx.body = {
      user: { id: _id, email }
    };
  });
};
