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

module.exports = {
  getProxyString,
  asyncForEach
};
