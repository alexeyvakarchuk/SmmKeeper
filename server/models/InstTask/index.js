const mongoose = require("mongoose");
const config = require("server/config/default");

const instTaskSchema = new mongoose.Schema({
  username: {
    type: String,
    required: "Task username is required"
  },
  profileId: {
    type: String,
    required: "Task profileId is required",
    index: true
  },
  sourceUsername: {
    type: String,
    required: "Source acc username is required"
  },
  sourceId: {
    type: String,
    required: "Source acc id is required"
  },
  type: {
    type: String,
    required: "Interaction type is required"
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number,
    required: "Interaction status is required"
  },
  unteractionsNum: {
    type: Number,
    default: 0
  },
  filters: {
    unique: {
      type: Boolean,
      default: true
    }
  },
  end_cursor: {
    type: String
  }
});

module.exports = mongoose.model("InstTask", instTaskSchema);
