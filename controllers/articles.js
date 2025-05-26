const { Joi } = require("celebrate");

const Article = require("../models/article");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

const articleSchema = Joi.object({
  source: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  url: Joi.string().uri().required(),
  urlToImage: Joi.string().uri().required(),
  publishedAt: Joi.string().isoDate().required(),
  keywords: Joi.array().items(Joi.string()).optional(),
});

module.exports.getArticles = (req, res, next) => {
  const userId = req.user._id;

  Article.find({ owner: userId }).then((articles) => res.send(articles));
};

module.exports.createArticle = (req, res, next) => {
  const { source, title, content, url, urlToImage, publishedAt, keywords } =
    req.body;

  const { error } = articleSchema.validate({
    source,
    title,
    content,
    url,
    urlToImage,
    publishedAt,
    keywords,
  });

  if (error) {
    next(new BadRequestError("Invalid article data: ", error));
  }

  Article.create({
    source,
    title,
    content,
    url,
    urlToImage,
    publishedAt,
    keywords,
    owner: req.user._id,
  })
    .then((article) => res.send(article))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId)
    .orFail(() => new NotFoundError("No article with matching ID found"))
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          "You don't have permissions to delete this article"
        );
      }
      return Article.findByIdAndDelete(articleId);
    })
    .then((article) => res.send(article))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};
