const router = require("express").Router();
const { createArticle, deleteArticle } = require("../controllers/articles");
const { validateArticleId } = require("../middlewares/validation");

router.post("/", createArticle);
router.delete("/:articleId", validateArticleId, deleteArticle);

module.exports = router;
