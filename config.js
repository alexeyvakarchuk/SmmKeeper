// @flow
const environment = process.env.NODE_ENV;

const baseURL =
  environment === "development"
    ? "http://localhost:3000"
    : "https://www.smmkeeper.co";

module.exports = { baseURL };
