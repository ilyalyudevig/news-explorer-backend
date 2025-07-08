const router = require("express").Router();
const { createArticle, deleteArticle } = require("../controllers/articles");
const { validateArticleId, validateArticleData } = require("../middlewares/validation");

router.post("/", validateArticleData, createArticle);
router.delete("/:articleId", validateArticleId, deleteArticle);

module.exports = router;
