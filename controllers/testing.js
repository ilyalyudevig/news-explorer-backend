const User = require('../models/user');
const Article = require('../models/article');

const reset = async (req, res, next) => {
  try {
    await User.deleteMany({});
    await Article.deleteMany({});
    await User.create({
      name: process.env.TEST_USER_NAME,
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { reset };
