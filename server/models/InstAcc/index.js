const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("email-validator");
const config = require("server/config/default");
const uniqueValidator = require("mongoose-unique-validator");

const instAccSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Connected user is required"
    },
    username: {
      type: String,
      required: "Username is required",
      unique: true,
      uniqueCaseInsensitive: true,
      index: true
    },
    password: {
      type: String,
      required: "Password is required"
    },
    status: {
      type: String,
      default: "Active"
    },
    bio: { type: String },
    externalUrl: { type: String },
    limits: {
      mf: {
        min: { type: Number, default: 1 },
        max: { type: Number, default: 45 },
        current: { type: Number, default: 20 }
      },
      ml: {
        min: { type: Number, default: 1 },
        max: { type: Number, default: 45 },
        current: { type: Number, default: 20 }
      }
    },
    stats: [
      {
        date: {
          type: Date,
          default: Date.now,
          timezone: "Europe/Kiev"
        },
        followers: { type: Number },
        follows: { type: Number }
      }
    ],
    // [String]: {
    //   followers: { type: Number },
    //   follows: { type: Number }
    // }
    proxy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proxy"
    },
    fullName: { type: String },
    profileId: { type: String },
    isBusinessAccount: { type: Boolean },
    businessCategoryName: { type: String },
    businessEmail: { type: String },
    businessPhoneNumber: { type: String },
    isPrivate: { type: Boolean },
    isVerified: { type: Boolean },
    profilePic: { type: String },
    countryCode: { type: String },
    phoneNumber: { type: String },
    gender: { type: Number },
    postsCount: { type: Number },
    interactions: [
      {
        username: {
          type: String,
          required: "Interaction username is required",
          index: true
        },
        taskId: {
          type: mongoose.Schema.Types.ObjectId,
          required: "Task Id is required"
        },
        type: {
          type: String,
          required: "Interaction type is required"
        },
        date: {
          type: Date,
          required: "Interaction date is required",
          default: Date.now
        }
      }
    ]
  },
  {
    strict: false,
    versionKey: false
  }
);

// Will show MongoError instead of ValidationError
instAccSchema.plugin(uniqueValidator, {
  message: "Insta acc with this {PATH} is already in use"
});

module.exports = mongoose.model("InstAcc", instAccSchema);
