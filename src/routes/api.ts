import e from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { EmployeeController } from "../controllers/employee-controller";
import { CompanyProfileController } from "../controllers/company-profile-controller";
import { CandidateProfileController } from "../controllers/candidate-profile-controller";
import { DisnakerProfileController } from "../controllers/disnaker-profile-controller";

export const apiRouter = e.Router();
// apiRouter.use(authMiddleware);

// karyawan api
apiRouter.post("/api/employee/create", EmployeeController.create);
apiRouter.post("/api/employee/update", EmployeeController.update);

// profile apis
apiRouter.post("/api/profile/company/upsert", CompanyProfileController.upsert);
apiRouter.post("/api/profile/candidate/upsert", CandidateProfileController.upsert);
apiRouter.post("/api/profile/disnaker/upsert", DisnakerProfileController.upsert);
