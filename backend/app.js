const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const productRouter = require("./controllers/products");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB", error.message);
  });

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/products", productRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
