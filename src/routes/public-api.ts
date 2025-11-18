import e from "express";
import { AdminController } from "../controllers/admin-controller";
import { CompanyController } from "../controllers/company-controller";

export const publicApiRouter = e.Router();

// admin api
publicApiRouter.post("/api/admin/register", AdminController.register);
publicApiRouter.post("/api/admin/login", AdminController.login);

// company api
publicApiRouter.post("/api/company/register", CompanyController.register);

// company api
publicApiRouter.post("/api/company/login", CompanyController.login);
