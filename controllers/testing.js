const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Article = require('../models/article');

const reset = async (req, res, next) => {
  try {
    await User.deleteMany({});
    await Article.deleteMany({});
    
    const hashedPassword = await bcrypt.hash(process.env.TEST_USER_PASSWORD, 10);
    
    await User.create({
      name: process.env.TEST_USER_NAME,
      email: process.env.TEST_USER_EMAIL,
      password: hashedPassword,
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { reset };
