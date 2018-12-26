const getProxyString = proxy =>
  proxy.auth && proxy.auth.login && proxy.auth.password
    ? `http://${proxy.auth.login}:${proxy.auth.password}@${proxy.host}:${
        proxy.port
      }`
    : `http://${proxy.host}:${proxy.port}`;

module.exports = {
  getProxyString
};
