/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { questsRouter } from "./quests/quests.router";
import { verifyRouter } from "./quests/verify.router";
import { usersRouter } from "./quests/users.router";
import { claimRouter } from "./quests/claim.router";
import { twitterRouter } from "./quests/twitter.router";

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
app.use("/api/users", usersRouter);
app.use("/api/claim", claimRouter);
app.use("/api/twitter", twitterRouter);

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
