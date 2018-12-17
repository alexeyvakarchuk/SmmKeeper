const should = require("chai").should();

const axios = require("axios");

const port = require("test/config.js").port;

const baseURL = `http://localhost:${port}`;

const { app } = require("server/server");

const User = require("server/models/User");

// not in config, because many test dirs are possible
const fixturesRoot = __dirname + "/fixtures";

describe("POST /api/sign-up", () => {
  let server;

  before(async () => {
    server = app.listen(port);
  });

  after(async () => {
    const user = await User.findOne({ email: data.email });

    await user.remove();

    server.close();
  });

  const data = {
    email: "alex@test.com",
    password: "12345678"
  };

  context("When user entered only email", () => {
    it('Should return 400 and "Password is required"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/sign-up",
          baseURL,
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

        e.response.data.error.message.should.be.equal("Password is required");
      }
    });
  });

  context("When user entered only password", () => {
    it('Should return 400 and "Email is required"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/sign-up",
          baseURL,
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

        e.response.data.error.message.should.be.equal("Email is required");
      }
    });
  });

  context("When user sent nothing", () => {
    it('Should return 400 and "Email is required"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/sign-up",
          baseURL,
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

        e.response.data.error.message.should.be.equal("Email is required");
      }
    });
  });

  context("When password is too small", () => {
    it('Should return 400 and "Password should contain at least 8 symbols"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/sign-up",
          baseURL,
          data: {
            email: data.email,
            password: "1234567"
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal(
          "Password should contain at least 8 symbols"
        );
      }
    });
  });

  context("When email is invalid", () => {
    it('Should return 400 and "Email is invalid"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/sign-up",
          baseURL,
          data: {
            email: "alex",
            password: data.password
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal("Email is invalid");
      }
    });
  });

  context("When already registered user with valid data", () => {
    before(async () => {
      await User.find({ email: data.email }).remove();
      await User.create(data);
    });

    it('Should return 400 and "User with this email already exists"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/sign-up",
          baseURL,
          data,
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal(
          "User with this email already exists"
        );
      }
    });
  });

  context("When new user with valid data", () => {
    before(async () => await User.find({ email: data.email }).remove());

    it("Should return 200 and user object", async () => {
      const response = await axios({
        method: "post",
        url: "/api/sign-up",
        baseURL,
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
