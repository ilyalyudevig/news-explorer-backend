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
const { dbAddress } = process.env;

app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);

app.use(requestLogger);

if (process.env.NODE_ENV !== 'production') {
  const testingRouter = require('./routes/testing');
  app.use('/testing', testingRouter);
}

app.use("/", routes);

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI || `mongodb://${dbAddress}`);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

module.exports = app;
