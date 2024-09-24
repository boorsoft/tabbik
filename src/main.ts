import express, {
  Application,
  json,
  Request,
  Response,
  urlencoded,
} from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import axios from "axios";
import api from "./api/v1";
import errorMiddleware from "./middleware/error.middleware";
import { redis } from "./redisClient";
import { Keys } from "./config/keys";

dotenv.config();

const app: Application = express();

const port: number = 3000;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 180,
});

axios.interceptors.request.use(async (config) => {
  const token = await redis.get(Keys.ACCES_TOKEN_DATA);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

app.use(cors());
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(compression());
app.use(morgan("dev"));
app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Tabbik!");
});

app.use("/api/v1", api);

app.use(errorMiddleware);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
