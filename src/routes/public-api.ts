import e from "express";
import { UserController } from "../controllers/user-controller";

export const publicApiRouter = e.Router();


// user auth
publicApiRouter.post("/api/user/register", UserController.register);
publicApiRouter.post("/api/user/login", UserController.login);
