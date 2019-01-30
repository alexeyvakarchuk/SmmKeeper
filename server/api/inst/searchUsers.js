const jwt = require("jsonwebtoken");
const { jwtsecret } = require("server/config/default"); // Secret key for JWT signin
const socket = require("server/libs/socket");
const { InvalidUserIdError } = require("server/api/errors");
const { getInstaClient } = require("server/api/utils");

exports.init = (router, clientStore) =>
  router.post("/api/inst/search-users", async function(ctx) {
    const { id, token, username, searchPhase } = ctx.request.body;

    if (jwt.verify(token, jwtsecret).id === id) {
      const client = await getInstaClient(id, username, clientStore);

      const searchResponse = await client.search({
        query: searchPhase,
        context: "user"
      });

      ctx.body = {
        searchResults: searchResponse.users
          .map(({ user: { username, profile_pic_url, follower_count } }) => ({
            username,
            profilePic: profile_pic_url,
            followers: follower_count
          }))
          .slice(0, 9)
      };
    } else {
      throw new InvalidUserIdError();
    }
  });
