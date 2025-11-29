import e from "express";
import { DisnakerController } from "../controllers/disnaker-controller";
import { disnakerAuth } from "../middleware/disnaker-auth";

export const disnakerApiRouter = e.Router();
disnakerApiRouter.use(disnakerAuth);

// disnaker profile api
disnakerApiRouter.get("/api/disnaker/contract/:status", DisnakerController.getContracts);
disnakerApiRouter.put("/api/disnaker/contract/:id/approve", DisnakerController.approveContract);
disnakerApiRouter.put("/api/disnaker/contract/:id/reject", DisnakerController.rejectContract);
