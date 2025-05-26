const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Please enter a valide email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const error = new Error("Incorrect email or password");
        error.name = "AuthorizationError";
        error.statusCode = 401;
        return Promise.reject(error);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error("Incorrect email or password");
          error.name = "AuthorizationError";
          error.statusCode = 401;
          return Promise.reject(error);
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
