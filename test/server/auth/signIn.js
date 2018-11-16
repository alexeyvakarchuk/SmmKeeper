const should = require("chai").should();

const axios = require("axios");

const port = require("test/config.js").port;

const app = require("server/server.js");

const User = require("server/models/User");

// not in config, because many test dirs are possible
const fixturesRoot = __dirname + "/fixtures";

const data = {
  email: "alex@test.com",
  password: "12345678"
};

describe("POST /api/sign-in", () => {
  let server;

  before(async () => {
    server = app.listen(port);

    await User.create(data);
  });

  after(async () => {
    const user = await User.findOne({ email: data.email });

    await user.remove();

    server.close();
  });

  context("When user entered only email", () => {
    it('Should return 400 and "Password or email are invalid"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/sign-in",
          data: {
            email: data.email,
            password: ""
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal(
          "Password or email are invalid"
        );
      }
    });
  });

  context("When user entered only password", () => {
    it('Should return 400 and "Password or email are invalid"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/sign-in",
          data: {
            email: "",
            password: data.password
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal(
          "Password or email are invalid"
        );
      }
    });
  });

  context("When user sent nothing", () => {
    it('Should return 400 and "Password or email are invalid"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/sign-in",
          data: {
            email: "",
            password: ""
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal(
          "Password or email are invalid"
        );
      }
    });
  });

  context("When user sent invalid data", () => {
    it('Should return 400 and "Password or email are invalid"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/sign-in",
          data: {
            email: "alex1234@test.com",
            password: "12345678"
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal(
          "Password or email are invalid"
        );
      }
    });
  });

  context("When user sent valid data", () => {
    it("Should return 200, user object and JWT token", async () => {
      const response = await axios({
        method: "post",
        url: "/api/sign-in",
        data,
        headers: {
          "Content-Type": "application/json"
        }
      });

      response.status.should.be.equal(200);

      response.data.token.should.be.a("string");

      response.data.user.id.should.be.a("string");

      response.data.user.email.should.be.equal(data.email);
    });
  });
});
