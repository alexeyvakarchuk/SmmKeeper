const Instagram = require("instagram-web-api");
const InstTask = require("server/models/InstTask");
const InstAcc = require("server/models/InstAcc");
const mf = require("./mf");
const FileCookieStore = require("tough-cookie-filestore2");
const { InvalidInstAccDataError } = require("server/api/errors");

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
      const acc = await InstAcc.findOne({ username });

      const { password } = acc;

      console.log(acc.populate("proxy"));

      const cookieStore = new FileCookieStore(
        resolve("server", `cookieStore/${username}.json`)
      );

      const client = new Instagram(
        { username, password, cookieStore },
        { proxy: `http://${proxy.host}:${proxy.port}` }
      );

      await client.login();
    } catch (e) {
      throw new InvalidInstAccDataError();
    }

    mf(username, client);
  });
};

startTasks();
