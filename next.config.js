// next.config.js
const withSass = require("@zeit/next-sass");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

module.exports = withSass({
  sassLoaderOptions: {
    sourceMap: true
  },
  postcssLoaderOptions: {
    sourceMap: true
  },
  webpack: config => {
    config.plugins.push(
      new SWPrecacheWebpackPlugin({
        verbose: true,
        staticFileGlobsIgnorePatterns: [/\.next\//],
        runtimeCaching: [
          {
            handler: "networkFirst",
            urlPattern: /^https?.*/
          }
        ]
      })
    );

    return config;
  }
});
