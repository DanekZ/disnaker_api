import e from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { EmployeeController } from "../controllers/employee-controller";
import { CompanyController } from "../controllers/company-controller";

export const apiRouter = e.Router();
// apiRouter.use(authMiddleware);

// karyawan api
apiRouter.post("/api/employee/create", EmployeeController.create);
apiRouter.post("/api/employee/update", EmployeeController.update);
// apiRouter.post("/api/employee/:employee_id/contract/create", EmployeeController.createContract);

// company api
apiRouter.post("/api/company/:company_id/position/create", CompanyController.createPosition);
apiRouter.put("/api/company/:company_id/position/:position_id/update", CompanyController.updatePosition);
apiRouter.get("/api/company/:company_id/position", CompanyController.getPosition);
apiRouter.delete("/api/company/:company_id/position/:position_id", CompanyController.deletePosition);

apiRouter.post("/api/company/:company_id/division/create", CompanyController.createDivision);
apiRouter.put("/api/company/:company_id/division/:division_id/update", CompanyController.updateDivision);
apiRouter.get("/api/company/:company_id/division", CompanyController.getDivision);
apiRouter.delete("/api/company/:company_id/division/:division_id", CompanyController.deleteDivision);
