require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const { limiter } = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/error-handler");
const routes = require("./routes");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./errors/NotFoundError");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);

mongoose.connect("mongodb://127.0.0.1:27017/news_explorer_db");

app.use(requestLogger);
app.use("/", routes);

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
