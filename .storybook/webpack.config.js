const path = require("path");

module.exports = (baseConfig, env, defaultConfig) => {
  // Extend defaultConfig as you need.

  // For example, add typescript loader:
  defaultConfig.module.rules.push({
    test: /\.scss|.sass$/,
    use: ["style-loader", "css-loader", "sass-loader"]
  });

  defaultConfig.resolve.extensions.push(".sass", ".scss");

  return defaultConfig;
};
