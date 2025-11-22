import e from "express";
import { CompanyController } from "../controllers/company-controller";
import { DisnakerController } from "../controllers/disnaker-controller";

export const publicApiRouter = e.Router();

// admin api
publicApiRouter.post("/api/disnaker/register", DisnakerController.register);
publicApiRouter.post("/api/disnaker/login", DisnakerController.login);

// company api
publicApiRouter.post("/api/company/register", CompanyController.register);
publicApiRouter.post("/api/company/login", CompanyController.login);
