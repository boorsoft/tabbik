import express, {
  Application,
  json,
  Request,
  Response,
  urlencoded,
} from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import api from "./api/v1";
import errorMiddleware from "./middleware/error.middleware";
import responseMiddleware from "./middleware/response.middleware";
import { initSocket } from "./common/socket/socket";

dotenv.config();

const app: Application = express();

const server = createServer(app);

initSocket(server);

const port: number = 3000;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 180,
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

app.use(responseMiddleware);

app.use("/api/v1", api);

app.use(errorMiddleware);

server.listen(port, function () {
  console.log(`Server is listening on port ${port} !`);
});
