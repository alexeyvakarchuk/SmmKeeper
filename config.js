// @flow
const environment = process.env.NODE_ENV;

const baseURL =
  environment === "development"
    ? "http://localhost:3000"
    : "https://lanp-tk.herokuapp.com";

module.exports = { baseURL };
