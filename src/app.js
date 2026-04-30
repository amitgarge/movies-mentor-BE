import cors from "cors";
import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import healthRoutes from "./routes/health.routes.js";
import moviesRoutes from "./routes/movies.routes.js";
import recommendRoutes from "./routes/recommend.routes.js";

const app = express();
const corsOrigin = process.env.CORS_ORIGIN;

app.use(
  cors({
    origin:
      !corsOrigin || corsOrigin === "*"
        ? "*"
        : corsOrigin.split(",").map((origin) => origin.trim()),
  }),
);
app.use(express.json());

app.use("/", healthRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/recommend", recommendRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
