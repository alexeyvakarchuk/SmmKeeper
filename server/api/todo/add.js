const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const socket = require("server/libs/socket");
const { InvalidUserIdError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/todo/add", async function(ctx) {
    const { id, token, name } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const user = await User.findById(id);

      user.todos.unshift({
        name
      });

      await user.save();

      socket.emitter.to(id).emit("newToDo", user.todos[0]);

      ctx.status = 200;
    } else {
      throw new InvalidUserIdError();
    }
  });
