const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const { InvalidUserIdError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/todo/fetch", async function(ctx) {
    const { id, token } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const user = await User.findById(id);

      ctx.status = 200;
      ctx.body = {
        todolist: user.todos
      };
    } else {
      throw new InvalidUserIdError();
    }
  });
