module.exports = {
  apps: [
    {
      name: "SmmKeeper",
      script: "./server/index.js",
      env_production: {
        NODE_ENV: "production",
        NODE_PATH: "./"
      },
      output: "./pm2/logs/-out.err",
      error: "./pm2/logs/-error.err"
    }
  ]
};
