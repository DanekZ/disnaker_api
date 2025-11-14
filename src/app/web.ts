import "dotenv/config";
import express from "express";
import cors from "cors";
import { apiRouter } from "../routes/api";
import { errorMiddleware } from "../middleware/error-middleware";
import { publicApiRouter } from "../routes/public-api";

const web = express();
web.use(express.json());
web.use(cors());

web.use(apiRouter);
web.use(publicApiRouter);

web.use(errorMiddleware);

export default web;
