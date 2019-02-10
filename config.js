// @flow
const environment = process.env.NODE_ENV;

const baseURL =
  environment === "development"
    ? "http://localhost:3004"
    : "https://www.smmkeeper.co";

module.exports = { baseURL };
