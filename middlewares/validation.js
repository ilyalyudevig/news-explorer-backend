const { Joi, celebrate } = require("celebrate");

module.exports.validateUserData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
  }),
});

module.exports.validateUserLoginData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateArticleId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24).messages({
      "string.length": 'The "articleId" field must be 24 characters',
      "string.alphanum":
        'The "articleId" field must contain only alphanumeric characters',
    }),
  }),
});

module.exports.validateArticleData = celebrate({
  body: Joi.object().keys({
    source: Joi.string().required().messages({
      "string.empty": 'The "source" field must be filled in',
    }),
    title: Joi.string().required().messages({
      "string.empty": 'The "title" field must be filled in',
    }),
    content: Joi.string().required().messages({
      "string.empty": 'The "content" field must be filled in',
    }),
    url: Joi.string().required().uri().messages({
      "string.empty": 'The "url" field must be filled in',
      "string.uri": 'The "url" field must be a valid URL',
    }),
    urlToImage: Joi.string().required().uri().messages({
      "string.empty": 'The "urlToImage" field must be filled in',
      "string.uri": 'The "urlToImage" field must be a valid URL',
    }),
    publishedAt: Joi.string().required().isoDate().messages({
      "string.empty": 'The "publishedAt" field must be filled in',
      "string.isoDate": 'The "publishedAt" field must be a valid ISO date',
    }),
    keywords: Joi.array().items(Joi.string()).required().messages({
      "array.empty": 'The "keywords" field must not be empty',
      "any.required": 'The "keywords" field is required',
    }),
  }),
});
