const mongoose = require("mongoose");
const config = require("server/config/default");

const proxySchema = new mongoose.Schema({
  host: {
    type: String,
    required: "Proxy host is required"
  },
  port: {
    type: String,
    required: "Proxy port is required"
  },
  auth: {
    login: {
      type: String
    },
    password: {
      type: String
    }
  },
  connectedAccounts: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Proxy", proxySchema);
