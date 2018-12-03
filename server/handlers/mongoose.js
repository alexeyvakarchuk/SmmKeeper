const mongoose = require("mongoose");

mongoose.Promise = Promise;

const environment = process.env.NODE_ENV;

if (environment === "development") {
  mongoose.set("debug", true);
}

exports.init = app =>
  mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/smmkeeper");
