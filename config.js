// @flow
const environment = process.env.NODE_ENV;

const baseURL =
  environment === "development"
    ? "http://localhost:3000"
    : "https://smmkeeper.herokuapp.com";

module.exports = { baseURL };
