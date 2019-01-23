const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const InstAcc = require("server/models/InstAcc");
const Instagram = require("instagram-web-api");
const {
  InvalidUserIdError,
  InvalidInstAccDataError,
  NoProxyError,
  AccIsAlreadyInUse
} = require("server/api/errors");
const Proxy = require("server/models/Proxy");
const fs = require("fs");
const { resolve } = require("path");
const FileCookieStore = require("tough-cookie-filestore2");
const { getProxyString } = require("server/api/utils");

exports.init = router =>
  router.post("/api/inst/request-verification", async function(ctx) {
    const { id, token, username, password } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      let proxy;

      const connectedProfile = await InstAcc.findOne({ username });

      // Check whether user with this username already exists
      if (!connectedProfile) {
        proxy = await Proxy.findOne(
          { connectedAccounts: { $eq: 0 } },
          "-_id -__v "
        );

        if (!proxy) {
          throw new NoProxyError();
        }

        if (!fs.existsSync(resolve("server/cookieStore"))) {
          fs.mkdirSync(resolve("server/cookieStore"));
        }

        fs.writeFileSync(resolve("server", `cookieStore/${username}.json`), "");
      } else {
        throw new AccIsAlreadyInUse();
      }

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
        console.log(`http://${proxy.host}:${proxy.port}`);

        await client.login();

        clientData = await client.getProfile();

        console.log("clientData", clientData);
      } catch (e) {
        console.log("Inst login error ::: ", e);

        if (e.error.message === "checkpoint_required") {
          ctx.body = {
            checkpointUrl: e.error.checkpoint_url,
            proxy
          };
        } else {
          throw new InvalidInstAccDataError();
        }
      }
    } else {
      throw new InvalidUserIdError();
    }
  });
