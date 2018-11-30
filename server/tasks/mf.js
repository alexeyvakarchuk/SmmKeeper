const Instagram = require("instagram-web-api");
const cron = require("node-cron");
const InstAcc = require("server/models/InstAcc");
const InstTask = require("server/models/InstTask");
const delay = require("server/utils/delay");

module.exports = (username, client) => {
  const cronTask = cron.schedule("*/2 * * * *", async () => {
    const task = await InstTask.findOne({
      username,
      type: "mf"
    });

    const acc = await InstAcc.findOne({ username });

    const { status, sourceId, end_cursor } = task;

    if (task && status === 1) {
      try {
        let source = await client.getFollowers({
          userId: sourceId,
          first: 1,
          after: end_cursor || undefined
        });

        // Will search until will not find the source acc with user haven't interacted before
        console.log(acc.interactions, source);
        while (
          !source.data.length ||
          acc.interactions.some(
            ({ username }) => username === source.data[0].username
          )
        ) {
          source = await client.getFollowers({
            userId: sourceId,
            first: 1,
            after: source.page_info.end_cursor || undefined
          });
        }

        await delay(15);

        await client.follow({ userId: source.data[0].id });

        await acc.interactions.unshift({
          username: source.data[0].username,
          taskId: task._id,
          type: "mf"
        });

        await acc.save();

        task.unteractionsNum++;
        task.end_cursor = source.page_info.end_cursor;
        await task.save();
      } catch (e) {
        console.log(e);

        if (e.name === "StatusCodeError" && e.statusCode === 429) {
          task.status = -1;
          await task.save();
          cronTask.destroy();
        }
      }
    } else {
      cronTask.destroy();
    }
  });
};
