const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const InstAcc = require("server/models/InstAcc");
const Instagram = require("instagram-web-api");
const { InvalidUserIdError, AccIsAlreadyInUse } = require("server/api/errors");
const Proxy = require("server/models/Proxy");
const fs = require("fs");
const { resolve } = require("path");
const FileCookieStore = require("tough-cookie-filestore2");

exports.init = router =>
  router.post("/api/inst/set-verification-type", async function(ctx) {
    const {
      id,
      token,
      proxy,
      username,
      password,
      checkpointUrl,
      verificationType
    } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const connectedProfile = await InstAcc.findOne({ username });

      // Check whether user with this username already exists
      if (connectedProfile) {
        throw new AccIsAlreadyInUse();
      }

      const cookieStore = new FileCookieStore(
        resolve("server", `cookieStore/${username}.json`)
      );

      const client = new Instagram(
        { username, password, cookieStore },
        { proxy: `http://${proxy.host}:${proxy.port}` }
      );

      try {
        let choise = 0;

        if (verificationType === "phone") {
          choice = 0;
        } else if (verificationType === "email") {
          choice = 1;
        }

        await client.updateChallenge({
          challengeUrl: checkpointUrl,
          choice
        });

        ctx.body = {
          verificationType
        };
      } catch (e) {
        console.log("Inst set verification error ::: ", e);
      }
    } else {
      throw new InvalidUserIdError();
    }
  });
