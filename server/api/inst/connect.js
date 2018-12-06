const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signing
const User = require("server/models/User");
const InstAcc = require("server/models/InstAcc");
const socket = require("server/libs/socket");
const { watchStats } = require("server/tasks/watchStats");
const Instagram = require("instagram-web-api");
const axios = require("axios");
const moment = require("moment");
const {
  InvalidUserIdError,
  InvalidInstAccDataError
} = require("server/api/errors");

exports.init = router =>
  router.post("/api/inst/connect", async function(ctx) {
    const { id, token, username, password } = ctx.request.body;

    let clientData;

    if (jwt.verify(token, jwtsecret).id === id) {
      try {
        const client = new Instagram({ username, password });

        await client.login();

        clientData = await client.getProfile();
      } catch (e) {
        console.log("Inst login error ::: ", e);
        throw new InvalidInstAccDataError();
      }

      const instdata = await axios({
        method: "get",
        url: `https://www.instagram.com/${username}`
      });

      // userInfoSource.data contains the HTML from Axios
      const jsonInfo = JSON.parse(
        instdata.data
          .match(
            /<script type="text\/javascript">window\._sharedData = (.*)<\/script>/
          )[1]
          .slice(0, -1)
      );

      const {
        biography,
        external_url,
        edge_followed_by,
        edge_follow,
        full_name,
        id: profileId,
        is_business_account,
        business_category_name,
        business_email,
        business_phone_number,
        is_private,
        is_verified,
        profile_pic_url_hd
      } = jsonInfo.entry_data.ProfilePage[0].graphql.user;

      const profile = {
        bio: biography,
        externalUrl: external_url,
        // followers: edge_followed_by.count,
        // follows: edge_follow.count,
        stats: [
          {
            followers: edge_followed_by.count,
            follows: edge_follow.count,
            date: moment()
          }
        ],
        fullName: full_name,
        profileId,
        isBusinessAccount: is_business_account,
        businessCategoryName: business_category_name,
        businessEmail: business_email,
        businessPhoneNumber: business_phone_number,
        isPrivate: is_private,
        isVerified: is_verified,
        profilePic: profile_pic_url_hd,
        countryCode: jsonInfo.country_code,
        phoneNumber: clientData.phone_number,
        gender: clientData.gender
      };

      console.log({
        userId: id,
        username,
        password,
        ...profile
      });

      const acc = await InstAcc.create({
        userId: id,
        username,
        password,
        ...profile
      });

      watchStats(username);

      // console.log(acc);

      // const user = await User.findById(id);

      // user.instAccounts.unshift(acc._id);

      // await user.save();

      socket.emitter.to(id).emit("connectInstAcc", {
        username,
        ...profile
      });

      ctx.status = 200;
    } else {
      throw new InvalidUserIdError();
    }
  });
