const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("email-validator");
const config = require("server/config/default");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: "Email is required",
      unique: true,
      uniqueCaseInsensitive: true,
      validate: [value => validator.validate(value), "Email is invalid"],
      index: true
    },
    passwordHash: {
      type: String
    },
    salt: {
      type: String
    },
    displayName: {
      type: String
    },
    providers: [
      {
        name: String,
        nameId: {
          type: String,
          index: true
        },
        profile: {} // updates just fine if I replace it with a new value, w/o going inside
      }
    ],
    passwordUpdateDate: {
      type: Number
    },
    todos: [
      {
        name: {
          type: String,
          required: "Task name is required"
        },
        description: {
          type: String
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        updatedAt: {
          type: Date,
          default: Date.now
        },
        dueDate: {
          type: Date
        },
        done: {
          type: Boolean,
          default: false
        },
        starred: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Will show MongoError instead of ValidationError
userSchema.plugin(uniqueValidator, { message: "{PATH} is not unique" });

// userSchema.path("email").set(function(email) {
//   if (!this.password) {
//   } else {
//     return email;
//   }
// });

userSchema
  .virtual("password")
  .set(function(password) {
    if (password) {
      if (password.length < 8) {
        this.invalidate(
          "password",
          "Password should contain at least 8 symbols"
        );
      } else {
        this._plainPassword = password;

        this.salt = crypto
          .randomBytes(config.crypto.hash.length)
          .toString("base64");

        this.passwordHash = crypto
          .pbkdf2Sync(
            password,
            this.salt,
            config.crypto.hash.iterations,
            config.crypto.hash.length,
            "sha512"
          )
          .toString("base64");

        this.passwordUpdateDate = Date.now();
      }
    } else {
      // remove password (unable to login w/ password any more, but can use providers)
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function() {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function(password) {
  if (!password) return false; // empty password means no login by password
  if (!this.passwordHash) return false; // this user does not have password (the line below would hang!)

  return (
    crypto
      .pbkdf2Sync(
        password,
        this.salt,
        config.crypto.hash.iterations,
        config.crypto.hash.length,
        "sha512"
      )
      .toString("base64") == this.passwordHash
  );
};

module.exports = mongoose.model("User", userSchema);
