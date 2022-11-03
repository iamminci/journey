/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { questsRouter } from "./quests/quests.router";
import { verifyRouter } from "./quests/verify.router";

/**
 * App Variables
 */
dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app: Express = express();

const port = process.env.PORT ?? 8888;

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/quests", questsRouter);
app.use("/api/verify", verifyRouter);

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
