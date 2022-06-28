import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { connectDB } from "./db/connect.js";
import { errorHandlerMIddleware } from "./middlewares/error-handler.js";
import { notFoundMiddleware } from "./middlewares/not-found.js";

import userRouter from "./routers/user.router.js";
import itemsRouter from "./routers/item.router.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const base = "/api/v1";

app.get(`${base}`, (req, res) => res.send("Connected"));
app.use(`${base}/users`, userRouter);
app.use(`${base}/items`, itemsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMIddleware);

const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

const start = async () => {
  try {
    console.log("connecting to DB...");
    await connectDB(mongoUri);
    app.listen(port, () =>
      console.log(`Server running at http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
