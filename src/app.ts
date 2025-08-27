import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { errorHandler } from "./middlewares/errorHandler";
import apiRoutes from "./routes";

const app: Express = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running!");
});
app.use("/api", apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default server;
