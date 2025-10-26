const express = require("express");
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const morgan = require("morgan");

const productsRouter = require("./routers/products.router");
const orderRouter = require("./routers/orders.router");
const customerRouter = require("./routers/users.router");
const reviewRouter = require("./routers/review.router");
const uploadRouter = require("./routers/upload.router");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/error.controller");

const app = express();

// Implement CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Develpment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Request limiting
const limit = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP! Try again after 1 hour.",
});
app.use("/api", limit);

// Body parser, reading data from  body into req.body
app.use(express.json({ limit: "10mb" }));

// Data sanitization against NoSQL query injections
app.use(mongoSanitize());

// Data sanitization agains XSS
app.use(xss());

// Prevent Parameter pollution. TODO...
// app.use(hpp({
//   whitelist: []
// }))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", customerRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/upload", uploadRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
