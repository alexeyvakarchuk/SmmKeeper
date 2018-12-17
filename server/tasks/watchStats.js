const cron = require("node-cron");
const axios = require("axios");
const moment = require("moment");
const InstAcc = require("server/models/InstAcc");

const watchStats = username => {
  const cronTask = cron.schedule("* 23 * * *", async () => {
    const acc = await InstAcc.findOne({ username });

    console.log(
      moment(),
      moment(acc.stats[0].date),
      moment().isAfter(moment(acc.stats[0].date), "day")
    );

    // Checks whether the current day is after the last day when stats was saved in db
    if (moment().isAfter(acc.stats[0].date, "day")) {
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
        edge_followed_by,
        edge_follow,
        profile_pic_url_hd,
        edge_owner_to_timeline_media
      } = jsonInfo.entry_data.ProfilePage[0].graphql.user;

      acc.stats.unshift({
        followers: edge_followed_by.count,
        follows: edge_follow.count
      });

      if (acc.postsCount !== edge_owner_to_timeline_media.count) {
        acc.postsCount = edge_owner_to_timeline_media.count;
      }

      if (acc.profilePic !== profile_pic_url_hd) {
        acc.profilePic = profile_pic_url_hd;
      }

      await acc.save();
    }
  });
};

const setStatsWatch = async () => {
  const accs = await InstAcc.find({}, "username");

  accs.forEach(({ username }) => {
    watchStats(username);
  });
};

setStatsWatch();

exports.watchStats = watchStats;
