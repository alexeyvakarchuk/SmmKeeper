const should = require("chai").should();

const axios = require("axios");

const port = require("test/config.js").port;

const baseURL = `http://localhost:${port}`;

const { app } = require("server/server");

const User = require("server/models/User");

// not in config, because many test dirs are possible
const fixturesRoot = __dirname + "/fixtures";

const reqData = {
  email: "alex@test.com",
  password: "12345678"
};

const newPassword = "12345678a";

let userData = {};

describe("POST /api/update-password", () => {
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
          url: "/api/update-password",
          baseURL,
          data: {
            id: userData.user.id,
            token: "123",
            email: reqData.email,
            password: reqData.password,
            newPassword: newPassword,
            newPasswordConfirm: newPassword
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
          url: "/api/update-password",
          baseURL,
          data: {
            id: "123",
            token: userData.token,
            email: reqData.email,
            password: reqData.password,
            newPassword: newPassword,
            newPasswordConfirm: newPassword
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

  context("When user haven't sent email", () => {
    it('Should return 400 and "Email is required"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/update-password",
          baseURL,
          data: {
            id: userData.user.id,
            token: userData.token,
            password: reqData.password,
            newPassword: newPassword,
            newPasswordConfirm: newPassword
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

  context("When user sent incorrect current password", () => {
    it('Should return 400 and "Password is required"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/update-password",
          baseURL,
          data: {
            id: userData.user.id,
            token: userData.token,
            email: reqData.email,
            password: "12345",
            newPassword: newPassword,
            newPasswordConfirm: newPassword
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal(
          "Current password is invalid"
        );
      }
    });
  });

  context("When user sent empty new password", () => {
    it('Should return 400 and "Password is required"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/update-password",
          baseURL,
          data: {
            id: userData.user.id,
            token: userData.token,
            email: reqData.email,
            password: reqData.password,
            newPassword: "",
            newPasswordConfirm: newPassword
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

  context("When user sent empty new password(confirm)", () => {
    it('Should return 400 and "Password is required"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/update-password",
          baseURL,
          data: {
            id: userData.user.id,
            token: userData.token,
            email: reqData.email,
            password: reqData.password,
            newPassword: newPassword,
            newPasswordConfirm: ""
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

  context("When user sent passwords that are not equal(>= 8 symbols)", () => {
    it('Should return 400 and "Passwords do not match"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/update-password",
          baseURL,
          data: {
            id: userData.user.id,
            token: userData.token,
            email: reqData.email,
            password: reqData.password,
            newPassword: newPassword,
            newPasswordConfirm: "12345678b"
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (e) {
        e.response.status.should.be.equal(400);

        e.response.data.error.message.should.be.equal("Passwords do not match");
      }
    });
  });

  context("When user sent passwords that are equal(< 8 symbols)", () => {
    it('Should return 400 and "Password should contain at least 8 symbols"', async () => {
      try {
        const response = await axios({
          method: "post",
          url: "/api/update-password",
          baseURL,
          data: {
            id: userData.user.id,
            token: userData.token,
            email: reqData.email,
            password: reqData.password,
            newPassword: "1234567",
            newPasswordConfirm: "1234567"
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

  context("When user sent passwords that are equal(>= 8 symbols)", () => {
    it("Should return 200", async () => {
      const response = await axios({
        method: "post",
        url: "/api/update-password",
        baseURL,
        data: {
          id: userData.user.id,
          token: userData.token,
          email: reqData.email,
          password: reqData.password,
          newPassword: newPassword,
          newPasswordConfirm: newPassword
        },
        headers: {
          "Content-Type": "application/json"
        }
      });

      response.status.should.be.equal(200);
    });
  });
});
