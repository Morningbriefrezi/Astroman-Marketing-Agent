import dotenv from "dotenv";
dotenv.config();

import { startBot } from "./telegram.js";

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

startBot();
