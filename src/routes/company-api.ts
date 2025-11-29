import e from "express";
import { EmployeeController } from "../controllers/employee-controller";
import { CompanyController } from "../controllers/company-controller";
import { ContractController } from "../controllers/contract-controller";
import { companyAuth } from "../middleware/company-auth";

export const companyApiRouter = e.Router();
companyApiRouter.use(companyAuth);

// company api
companyApiRouter.post("/api/company/:company_id/position/create", CompanyController.createPosition);
companyApiRouter.put("/api/company/:company_id/position/:position_id/update", CompanyController.updatePosition);
companyApiRouter.get("/api/company/:company_id/position", CompanyController.getPosition);
companyApiRouter.delete("/api/company/:company_id/position/:position_id", CompanyController.deletePosition);

companyApiRouter.post("/api/company/:company_id/division/create", CompanyController.createDivision);
companyApiRouter.put("/api/company/:company_id/division/:division_id/update", CompanyController.updateDivision);
companyApiRouter.get("/api/company/:company_id/division", CompanyController.getDivision);
companyApiRouter.delete("/api/company/:company_id/division/:division_id", CompanyController.deleteDivision);

// karyawan api
companyApiRouter.get("/api/company/:company_id/employee", EmployeeController.get);
companyApiRouter.post("/api/company/:company_id/employee/create", EmployeeController.create);
companyApiRouter.put("/api/employee/:employee_id/update", EmployeeController.update);
companyApiRouter.delete("/api/employee/:employee_id", EmployeeController.delete);
companyApiRouter.get("/api/employee/:employee_id", EmployeeController.getDetail);

// kontrak api
companyApiRouter.get("/api/employee/:employee_id/contract", ContractController.get);
companyApiRouter.post("/api/employee/:employee_id/contract/create", ContractController.create);
companyApiRouter.put("/api/employee/:employee_id/contract/:contract_id/update", ContractController.update);
