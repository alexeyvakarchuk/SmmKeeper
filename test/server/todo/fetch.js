const should = require("chai").should();

const axios = require("axios");

const port = require("test/config.js").port;

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

describe("POST /api/todo/fetch", () => {
  let server;

  before(async () => {
    server = app.listen(port);

    await User.create(reqData);

    const res = await axios({
      method: "post",
      url: "/api/sign-in",
      data: reqData,
      headers: {
        "Content-Type": "application/json"
      }
    });

    userData = res.data;

    await axios({
      method: "post",
      url: "/api/todo/add",
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
          url: "/api/todo/fetch",
          data: {
            id: userData.user.id,
            token: "123"
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
          url: "/api/todo/fetch",
          data: {
            id: "123",
            token: userData.token
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

  context("When user sent valid data", () => {
    it("Should return 200 and todos array", async () => {
      const response = await axios({
        method: "post",
        url: "/api/todo/fetch",
        data: {
          id: userData.user.id,
          token: userData.token
        },
        headers: {
          "Content-Type": "application/json"
        }
      });

      response.status.should.be.equal(200);

      const user = await User.findOne({ email: reqData.email });

      user.todos.length.should.be.equal(response.data.todolist.length);
    });
  });
});
