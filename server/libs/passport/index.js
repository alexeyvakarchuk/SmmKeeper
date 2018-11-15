const passport = require("koa-passport");
const User = require("server/models/User");

require("./serialize");

require("./localStrategy");

require("./googleStrategy");

require("./jwtStrategy");

module.exports = passport;
