const Instagram = require("instagram-web-api");
const FileCookieStore = require("tough-cookie-filestore2");
const User = require("server/models/User");
const InstAcc = require("server/models/InstAcc");
const {
  InvalidInstAccDataError,
  CheckpointIsRequiredError
} = require("server/api/errors");
const { resolve } = require("path");

const getProxyString = proxy =>
  proxy.auth && proxy.auth.login && proxy.auth.password
    ? `http://${proxy.auth.login}:${proxy.auth.password}@${proxy.host}:${
        proxy.port
      }`
    : `http://${proxy.host}:${proxy.port}`;

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const getInstaClient = async (id, username, clientStore) => {
  if (clientStore[username]) {
    return clientStore[username];
  } else {
    const user = await User.findById(id);

    let acc;

    try {
      acc = await InstAcc.findOne({ username }).populate("proxy");

      const { password, proxy } = acc;

      const cookieStore = new FileCookieStore(
        resolve("server", `cookieStore/${username}.json`)
      );

      const client = new Instagram(
        { username, password, cookieStore },
        {
          proxy: getProxyString(proxy)
        }
      );

      await client.login();

      clientStore[username] = client;

      return client;
    } catch (e) {
      console.log(e.error);

      if (e.error.message === "checkpoint_required") {
        throw new CheckpointIsRequiredError({
          id,
          username,
          checkpointUrl: e.error.checkpoint_url,
          proxy: acc.proxy
        });
      } else {
        throw new InvalidInstAccDataError();
      }
    }
  }
};

module.exports = {
  getProxyString,
  asyncForEach,
  getInstaClient
};
