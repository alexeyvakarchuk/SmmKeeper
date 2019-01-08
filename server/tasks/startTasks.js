const Instagram = require("instagram-web-api");
const InstTask = require("server/models/InstTask");
const InstAcc = require("server/models/InstAcc");
const mf = require("./mf");
const { resolve } = require("path");
const FileCookieStore = require("tough-cookie-filestore2");
const {
  InvalidInstAccDataError,
  CheckpointIsRequiredError
} = require("server/api/errors");
const { getProxyString } = require("server/api/utils");

const startTasks = async () => {
  const tasks = await InstTask.find({
    status: 1,
    type: "mf"
  });

  // console.log("tasks ::: ", tasks);

  tasks.forEach(async ({ _id, username }) => {
    // console.log("username ::: ", username);

    let client;
    let acc;

    try {
      acc = await InstAcc.findOne({ username }).populate("proxy");

      const { _id, password, proxy } = acc;

      const cookieStore = new FileCookieStore(
        resolve("server", `cookieStore/${username}.json`)
      );

      client = new Instagram(
        { username, password, cookieStore },
        {
          proxy: getProxyString(proxy)
        }
      );

      await client.login();
    } catch (e) {
      console.log(e);

      if (e.error.message === "checkpoint_required") {
        throw new CheckpointIsRequiredError({
          id: acc.userId,
          username,
          checkpointUrl: e.error.checkpoint_url,
          proxy: acc.proxy
        });
      } else {
        throw new InvalidInstAccDataError();
      }
    }

    mf(username, _id, client);
  });
};

startTasks();
