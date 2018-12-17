const should = require("chai").should();

const axios = require("axios");

const port = require("test/config.js").port;

const baseURL = `http://localhost:${port}`;

const { app } = require("server/server.js");

const User = require("server/models/User");

// not in config, because many test dirs are possible
const fixturesRoot = __dirname + "/fixtures";

const reqData = {
  email: "alex@test.com",
  password: "12345678"
};

let userData = {};

describe("POST /api/check-password-existence", () => {
  let server;

  before(async () => {
    server = app.listen(port);

    console.log(port);

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
  });

  after(async () => {
    const user = await User.findOne({ email: reqData.email });

    await user.remove();

    server.close();
  });

  context("When user sent invalid token", () => {
    it('Should return 401 and "User token is invalid"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/check-password-existence",
          baseURL,
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
          url: "/api/check-password-existence",
          baseURL,
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

  context("When user sent valid data and user has password", () => {
    it('Should return 200 and "passwordExist: true"', async () => {
      const response = await axios({
        method: "post",
        url: "/api/check-password-existence",
        baseURL,
        data: {
          id: userData.user.id,
          token: userData.token
        },
        headers: {
          "Content-Type": "application/json"
        }
      });

      response.status.should.be.equal(200);

      response.data.passwordExist.should.be.equal(true);
    });
  });

  context("When user sent valid data and user doesn't have password", () => {
    before(async () => {
      const user = await User.findOne({ email: reqData.email });

      user.password = "";
      user.passwordUpdateDate = undefined;

      await user.save();
    });

    it('Should return 200 and "passwordExist: false"', async () => {
      const response = await axios({
        method: "post",
        url: "/api/check-password-existence",
        baseURL,
        data: {
          id: userData.user.id,
          token: userData.token
        },
        headers: {
          "Content-Type": "application/json"
        }
      });

      response.status.should.be.equal(200);

      response.data.passwordExist.should.be.equal(false);
    });
  });
});
