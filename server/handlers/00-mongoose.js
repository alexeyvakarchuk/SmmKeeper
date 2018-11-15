const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

mongoose.Promise = Promise;

const environment = process.env.NODE_ENV;

if (environment === "development") {
  mongoose.set("debug", true);
}

// Will show MongoError instead of ValidationError
mongoose.plugin(beautifyUnique);

exports.init = app =>
  mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/timekeeper");
