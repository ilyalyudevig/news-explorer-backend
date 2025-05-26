const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getArticles } = require("../controllers/articles");
const { createUser, login } = require("../controllers/users");
const {
  validateUserData,
  validateUserLoginData,
} = require("../middlewares/validation");

router.post("/signup", validateUserData, createUser);
router.post("/signin", validateUserLoginData, login);

router.get("/articles", auth, getArticles);
router.use("/users", auth, require("./users"));
router.use("/articles", auth, require("./articles"));

module.exports = router;
