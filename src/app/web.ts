import "dotenv/config";
import express from "express";
import cors from "cors";
import { companyApiRouter } from "../routes/company-api";
import { errorMiddleware } from "../middleware/error-middleware";
import { publicApiRouter } from "../routes/public-api";
import { disnakerApiRouter } from "../routes/disnaker-api";

const web = express();
web.use(express.json());
web.use(cors());

web.use(publicApiRouter);
web.use(companyApiRouter);
web.use(disnakerApiRouter);

web.use(errorMiddleware);

export default web;
