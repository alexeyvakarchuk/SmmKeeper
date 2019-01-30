const cron = require("node-cron");
const InstAcc = require("server/models/InstAcc");
const InstTask = require("server/models/InstTask");
const delay = require("server/utils/delay");

module.exports = (username, taskId, client) => {
  const cronTask = cron.schedule("*/2 * * * *", async () => {
    const task = await InstTask.findById(taskId);

    const acc = await InstAcc.findOne({ username }).populate("proxy");

    const { status, sourceId, end_cursor } = task;

    // console.log("task ::: ", task);
    // console.log("acc ::: ", acc);

    if (task && status === 1) {
      try {
        let source = await client.getFollowers({
          userId: sourceId,
          first: 1,
          after: end_cursor || undefined
        });

        // Will search until will not find the source acc with user haven't interacted before
        console.log(acc.username, source.data);
        while (
          !source.data.length ||
          !acc.interactions.some(
            ({ username, type }) =>
              username === source.data[0].username && type === "mf"
          )
        ) {
          source = await client.getFollowings({
            userId: sourceId,
            first: 1,
            after: source.page_info.end_cursor || undefined
          });
        }

        await delay(15);

        await client.unfollow({ userId: source.data[0].id });

        await acc.interactions.unshift({
          username: source.data[0].username,
          taskId: task._id,
          type: "uf"
        });

        await acc.save();

        task.unteractionsNum++;
        task.end_cursor = source.page_info.end_cursor;
        await task.save();
      } catch (e) {
        console.log("Task error(UF) ::: ", e);

        console.log(e.name, e.error);

        if (e.name === "StatusCodeError") {
          task.status = -1;
          await task.save();
          cronTask.destroy();

          if (e.error && e.error.message) {
            if (e.error.message === "checkpoint_required") {
              throw new CheckpointIsRequiredError({
                id: acc.userId,
                username,
                checkpointUrl: e.error.checkpoint_url,
                proxy: acc.proxy
              });
              acc.status = "CheckpointRequired";
              await acc.save();
            } else if (e.error.message === "rate limited") {
              acc.status = "RateLimited";
              await acc.save();
            } else if (
              e.error.message ===
              "Sorry, you're following the max limit of accounts. You'll need to unfollow some accounts to start following more."
            ) {
              acc.status = "FollowsLimitExceeded";
              await acc.save();
            }
          } else if (e.message === "403 - undefined") {
            acc.status = "PasswordWasChanged";
            await acc.save();
          }
        }
      }
    } else {
      cronTask.destroy();
    }
  });
};
