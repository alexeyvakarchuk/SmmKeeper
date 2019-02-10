const path = require("path");

module.exports = (baseConfig, env, defaultConfig) => {
  // Extend defaultConfig as you need.

  // For example, add typescript loader:
  defaultConfig.module.rules.push({
    test: /\.scss|.sass$/,
    use: ["style-loader", "css-loader", "sass-loader"]
  });

  defaultConfig.module.rules.push({
    // test: /\.stories\.js?$/,
    test: /\.jsx?$/,
    loaders: [require.resolve("@storybook/addon-storysource/loader")],
    enforce: "pre"
  });

  defaultConfig.resolve.extensions.push(".sass", ".scss");

  defaultConfig.resolve.alias.styles = path.resolve(__dirname, "../styles/");

  return defaultConfig;
};
