# News Explorer Backend

[![CI](https://github.com/ilyalyudevig/news-explorer-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/ilyalyudevig/news-explorer-backend/actions/workflows/ci.yml)

This repository contains the backend for the [News Explorer](https://news-explorer.info) application, a service for discovering and saving news articles. It is built with Node.js and Express, and it provides a RESTful API for managing users and articles.

## Interesting Techniques

This project uses several modern JavaScript techniques and best practices:

- **[Custom Middleware](https://expressjs.com/en/guide/using-middleware.html)**: The application features a robust middleware chain for handling authentication, logging, rate limiting, and validation. You can find these in the [`middlewares/`](./middlewares/) directory.
- **[Custom Error Handling](https://expressjs.com/en/guide/error-handling.html)**: The application uses a centralized error-handling mechanism with custom error classes, located in the [`errors/`](./errors/) directory. This approach keeps the code clean and organized.
- **[Environment Variables](https://www.npmjs.com/package/dotenv)**: The project uses the `dotenv` library to manage environment variables, keeping sensitive information out of the codebase.
- **[Request Validation](https://www.npmjs.com/package/celebrate)**: The `celebrate` library is used to validate incoming request data against a predefined schema, which helps to ensure data integrity.

## Technologies and Libraries

The project relies on the following technologies and libraries:

- **[Node.js](https://nodejs.org/)**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **[Express](https://expressjs.com/)**: A fast, unopinionated, minimalist web framework for Node.js.
- **[Mongoose](https://mongoosejs.com/)**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **[Celebrate](https://www.npmjs.com/package/celebrate)**: A middleware for request validation.
- **[Winston](https://www.npmjs.com/package/winston)**: A logger for just about everything.
- **[Helmet](https://helmetjs.github.io/)**: A library to help secure Express apps by setting various HTTP headers.
- **[express-rate-limit](https://www.npmjs.com/package/express-rate-limit)**: A rate-limiting middleware for Express.
- **[JSON Web Token](https://jwt.io/)**: A compact, URL-safe means of representing claims to be transferred between two parties.
- **[bcrypt.js](https://www.npmjs.com/package/bcryptjs)**: A library for hashing passwords.
- **[CORS](https://www.npmjs.com/package/cors)**: A middleware for enabling Cross-Origin Resource Sharing.

## Project Structure

```txt
.
├── app.js
├── package.json
├── controllers/
├── errors/
├── middlewares/
├── models/
├── routes/
└── utils/
```

- **`controllers/`**: This directory contains the logic for handling incoming requests, interacting with the models, and sending responses.
- **`errors/`**: This directory holds custom error classes for handling different types of errors in a structured way.
- **`middlewares/`**: This directory contains custom middleware for tasks such as authentication, logging, and request validation.
- **`models/`**: This directory defines the Mongoose schemas for the `user` and `article` collections in the database.
- **`routes/`**: This directory contains the Express router files, which define the API endpoints and connect them to the corresponding controller functions.
- **`utils/`**: This directory contains utility files, such as configuration settings.
