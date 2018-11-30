const Instagram = require("instagram-web-api");
const InstTask = require("server/models/InstTask");
const InstAcc = require("server/models/InstAcc");
const mf = require("./mf");
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

      client = new Instagram({ username, password });

      await client.login();
    } catch (e) {
      throw new InvalidInstAccDataError();
    }

    mf(username, client);
  });
};

startTasks();
