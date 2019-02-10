module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  // domain: "http://localhost:3000",
  host: "localhost",
  get redisConfig() {
    if (process.env.REDISCLOUD_URL) {
      const { auth, hostname, port } = require("url").parse(
        process.env.REDISCLOUD_URL
      );

      return {
        host: hostname,
        port,
        password: auth.split(":")[1]
      };
    } else {
      return {
        host: "127.0.0.1",
        port: "6379"
      };
    }
  },
  port: process.env.NODE_ENV === "production" ? 3000 : 3004,
  // get domain() {
  //   return `http://localhost:${this.port}`;
  // },
  secret: "mysecret",
  root: process.cwd(),
  crypto: {
    hash: {
      length: 128,
      // may be slow(!): iterations = 12000 take ~60ms to generate strong password
      iterations: process.env.NODE_ENV === "production" ? 12000 : 1
    }
  },
  jwtsecret: "traneflp18"
};
