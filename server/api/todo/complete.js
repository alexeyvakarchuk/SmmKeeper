const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const socket = require("server/libs/socket");
const { InvalidUserIdError, InvalidTodoIdError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/todo/complete", async function(ctx) {
    const { userId, token, todoId } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === userId) {
      const user = await User.findById(userId);

      try {
        user.todos.find(el => el._id == todoId).done = true;
      } catch (e) {
        throw new InvalidTodoIdError();
      }

      await user.save();

      socket.emitter.emit("completeToDo", todoId);

      ctx.status = 200;
    } else {
      throw new InvalidUserIdError();
    }
  });
