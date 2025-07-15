const User = require('../models/user');
const Article = require('../models/article');
const { TEST_USER } = require('../utils/config');

const reset = async (req, res, next) => {
  try {
    await User.deleteMany({});
    await Article.deleteMany({});
    await User.create(TEST_USER);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { reset };
