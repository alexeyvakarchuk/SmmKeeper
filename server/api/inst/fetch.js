const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const InstAcc = require("server/models/InstAcc");
const Instagram = require("instagram-web-api");
const { InvalidUserIdError } = require("server/api/errors");

exports.init = router =>
  router.post("/api/inst/fetch", async function(ctx) {
    const { id, token } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const user = await User.findById(id);

      const accs = await InstAcc.find({ userId: user._id });

      // accs.forEach(el => ({
      //   ...el,
      //   _id: undefined,
      //   userId: undefined
      // }));

      // console.log(accs);

      // const client = new Instagram({
      //   username: "alexvakarchuk",
      //   password: "know1998"
      // });

      // await client.login();

      // const userr = await client.getUserByUsername({
      //   username: "alexvakarchuk"
      // });
      // console.log(userr);

      ctx.status = 200;

      ctx.body = {
        accList: accs.length ? accs : []
      };
    } else {
      throw new InvalidUserIdError();
    }
  });
