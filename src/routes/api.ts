import e from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { EmployeeController } from "../controllers/employee-controller";
import { CompanyController } from "../controllers/company-controller";
import { ContractController } from "../controllers/contract-controller";

export const apiRouter = e.Router();
// apiRouter.use(authMiddleware);

// company api
apiRouter.post("/api/company/:company_id/position/create", CompanyController.createPosition);
apiRouter.put("/api/company/:company_id/position/:position_id/update", CompanyController.updatePosition);
apiRouter.get("/api/company/:company_id/position", CompanyController.getPosition);
apiRouter.delete("/api/company/:company_id/position/:position_id", CompanyController.deletePosition);

apiRouter.post("/api/company/:company_id/division/create", CompanyController.createDivision);
apiRouter.put("/api/company/:company_id/division/:division_id/update", CompanyController.updateDivision);
apiRouter.get("/api/company/:company_id/division", CompanyController.getDivision);
apiRouter.delete("/api/company/:company_id/division/:division_id", CompanyController.deleteDivision);

// karyawan api
apiRouter.get("/api/company/:company_id/employee", EmployeeController.get);
apiRouter.post("/api/company/:company_id/employee/create", EmployeeController.create);
apiRouter.put("/api/employee/:employee_id/update", EmployeeController.update);
apiRouter.delete("/api/employee/:employee_id", EmployeeController.delete);
apiRouter.get("/api/employee/:employee_id", EmployeeController.getDetail);

// kontrak api
apiRouter.get("/api/employee/:employee_id/contract", ContractController.get);
apiRouter.post("/api/employee/:employee_id/contract/create", ContractController.create);
// apiRouter.put("/api/employee/:id_karyawan/contract/:id_contract/update", ContractController.update);
