const should = require("chai").should();

const axios = require("axios");

const port = require("test/config.js").port;

const baseURL = `http://localhost:${port}`;

const app = require("server/server.js");

const User = require("server/models/User");

// not in config, because many test dirs are possible
const fixturesRoot = __dirname + "/fixtures";

const reqData = {
  email: "alex@test.com",
  password: "12345678"
};

let userData = {};

let todoData = {};

describe("POST /api/todo/incomplete", () => {
  let server;

  before(async () => {
    server = app.listen(port);

    await User.create(reqData);

    const res = await axios({
      method: "post",
      url: "/api/sign-in",
      data: reqData,
      baseURL,
      headers: {
        "Content-Type": "application/json"
      }
    });

    userData = res.data;

    await axios({
      method: "post",
      url: "/api/todo/add",
      baseURL,
      data: {
        id: userData.user.id,
        name: "Todo 1",
        token: userData.token
      },
      headers: {
        "Content-Type": "application/json"
      }
    });

    const user = await User.findOne({ email: reqData.email });

    todoData = user.todos[0];
  });

  after(async () => {
    const user = await User.findOne({ email: reqData.email });

    await user.remove();

    server.close();
  });

  context("When user sent invalid user token", () => {
    it('Should return 401 and "User token is invalid"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/todo/incomplete",
          baseURL,
          data: {
            userId: userData.user.id,
            token: "123",
            todoId: todoData.id
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(401);

        e.response.data.error.message.should.be.equal("User token is invalid");
      }
    });
  });

  context("When user sent invalid userId", () => {
    it('Should return 400 and "User id is invalid"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/todo/incomplete",
          baseURL,
          data: {
            userId: "123",
            token: userData.token,
            todoId: todoData.id
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal("User id is invalid");
      }
    });
  });

  context("When user sent invalid todoId", () => {
    it('Should return 400 and "Todo id is invalid"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/todo/incomplete",
          baseURL,
          data: {
            userId: userData.user.id,
            token: userData.token,
            todoId: "123"
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal("Todo id is invalid");
      }
    });
  });

  context("When user sent valid data", () => {
    it('Should return 200 and set todo\'s done property to "false"', async () => {
      const response = await axios({
        method: "post",
        url: "/api/todo/incomplete",
        baseURL,
        data: {
          userId: userData.user.id,
          token: userData.token,
          todoId: todoData.id
        },
        headers: {
          "Content-Type": "application/json"
        }
      });

      response.status.should.be.equal(200);

      const user = await User.findOne({ email: reqData.email });

      user.todos[0].done.should.be.equal(false);
    });
  });
});
