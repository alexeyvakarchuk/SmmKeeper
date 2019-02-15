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
const { getProxyString } = require("server/api/utils");

exports.init = router =>
  router.post("/api/inst/resend-verification-code", async function(ctx) {
    const {
      id,
      token,
      proxy,
      username,
      password,
      checkpointUrl
    } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const cookieStore = new FileCookieStore(
        resolve("server", `cookieStore/${username}.json`)
      );

      const client = new Instagram(
        { username, password, cookieStore },
        {
          proxy: getProxyString(proxy)
        }
      );

      try {
        await client.replayChallenge({
          challengeUrl: checkpointUrl
        });

        ctx.status = 200;
      } catch (e) {
        console.log("Inst resend verification code error ::: ", e);

        ctx.status = 400;
      }
    } else {
      throw new InvalidUserIdError();
    }
  });
