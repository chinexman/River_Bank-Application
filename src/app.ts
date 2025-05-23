import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import databaseConnection from "./config/db_config";
import dotenv from "dotenv";
import usersRouter from "./routers/users";
import mainAccountRouter from "./routers/account_router";
import { apiRateLimiter } from "./middleware/rateLimiter";



dotenv.config();

const app = express();

databaseConnection();

// view engine setup
app.set("views", path.join(__dirname, "../", "views"));
app.set("view engine", "jade");

app.use("/accounts", apiRateLimiter);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.send("Welcome to River Banking . view documentation for Endpoints");
});

app.use("/users", usersRouter);
app.use("/accounts", mainAccountRouter);


// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
