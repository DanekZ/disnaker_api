import e from "express";
import { AdminController } from "../controllers/admin-controller";

export const publicApiRouter = e.Router();

// admin api
publicApiRouter.post("/api/admin/register", AdminController.register);
publicApiRouter.post("/api/admin/login", AdminController.login)
