import e from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { EmployeeController } from "../controllers/employee-controller";

export const apiRouter = e.Router();
// apiRouter.use(authMiddleware);

// karyawan api
apiRouter.post("/api/employee/create", EmployeeController.create);
apiRouter.post("/api/employee/update", EmployeeController.update);
