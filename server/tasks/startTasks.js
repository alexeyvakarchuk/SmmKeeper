const Instagram = require("instagram-web-api");
const InstTask = require("server/models/InstTask");
const InstAcc = require("server/models/InstAcc");
const mf = require("./mf");
const { resolve } = require("path");
const FileCookieStore = require("tough-cookie-filestore2");
const { InvalidInstAccDataError } = require("server/api/errors");
const { getProxyString } = require("server/api/utils");

const startTasks = async () => {
  const tasks = await InstTask.find({
    status: 1,
    type: "mf"
  });

  // console.log("tasks ::: ", tasks);

  tasks.forEach(async ({ username }) => {
    // console.log("username ::: ", username);

    let client;

    try {
      const acc = await InstAcc.findOne({ username }).populate("proxy");

      const { password, proxy } = acc;

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
      throw new InvalidInstAccDataError();
    }

    mf(username, client);
  });
};

startTasks();
