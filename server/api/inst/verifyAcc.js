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
  AccIsAlreadyInUse,
  InvalidVerificationCodeError,
  InvalidInstAccDataError
} = require("server/api/errors");
const Proxy = require("server/models/Proxy");
const fs = require("fs");
const { resolve } = require("path");
const FileCookieStore = require("tough-cookie-filestore2");
const { getProxyString } = require("server/api/utils");

exports.init = router =>
  router.post("/api/inst/verify-acc", async function(ctx) {
    const {
      id,
      token,
      proxy,
      username,
      password,
      checkpointUrl,
      securityCode
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
        {
          proxy: getProxyString(proxy)
        }
      );

      if (checkpointUrl && securityCode) {
        try {
          console.log(client);
          console.log({
            challengeUrl: checkpointUrl,
            securityCode
          });

          await client.updateChallenge({
            challengeUrl: checkpointUrl,
            securityCode
          });
        } catch (e) {
          console.log(e);
          // console.log("CHALLENGE error");
          // fs.writeFileSync(resolve("server", `cookieStore/${username}.json`), "");
          throw new InvalidVerificationCodeError();
        }
      }

      try {
        await client.login();

        clientData = await client.getProfile();

        console.log("clientData", clientData);
      } catch (e) {
        console.log("Inst login error ::: ", e);

        throw new InvalidInstAccDataError();
      }

      const proxyDb = await Proxy.findOne({
        host: proxy.host,
        port: proxy.port
      });
      proxyDb.connectedAccounts += 1;

      await proxyDb.save();

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

      console.log(jsonInfo.entry_data.ProfilePage[0].graphql.user);

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
        edge_owner_to_timeline_media,
        is_private,
        is_verified,
        profile_pic_url_hd
      } = jsonInfo.entry_data.ProfilePage[0].graphql.user;

      const profile = {
        bio: biography,
        externalUrl: external_url,
        postsCount: edge_owner_to_timeline_media.count,
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
        gender: clientData.gender,
        proxy: proxyDb._id
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

      socket.emitter.to(id).emit("connectInstAcc", acc);

      ctx.status = 200;
    } else {
      throw new InvalidUserIdError();
    }
  });
