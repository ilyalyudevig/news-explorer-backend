const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const InternalServerError = require("../errors/InternalServerError");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => new NotFoundError("No user with matching ID found"))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("User with this email already exists");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => {
      if (!user) {
        throw new InternalServerError("User creation failed");
      }
      res.send({
        user: {
          email: user.email,
          name: user.name,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(next);
};
