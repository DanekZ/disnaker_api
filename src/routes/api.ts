import e from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { EmployeeController } from "../controllers/employee-controller";
import { CompanyProfileController } from "../controllers/company-profile-controller";
import { CandidateProfileController } from "../controllers/candidate-profile-controller";
import { DisnakerProfileController } from "../controllers/disnaker-profile-controller";
import { UserController } from "../controllers/user-controller";
import { RbacController } from "../controllers/rbac-controller";
import { JobsController } from "../controllers/jobs-controller";
import { JobApplicationController } from "../controllers/job-application-controller";
import { requirePermission } from "../middleware/rbac-middleware";

export const apiRouter = e.Router();
// apiRouter.use(authMiddleware);

// karyawan api
apiRouter.post("/api/employee/create", EmployeeController.create);
apiRouter.post("/api/employee/update", EmployeeController.update);

// profile apis
apiRouter.post("/api/profile/company/upsert", CompanyProfileController.upsert);
apiRouter.post("/api/profile/candidate/upsert", CandidateProfileController.upsert);
apiRouter.post("/api/profile/disnaker/upsert", DisnakerProfileController.upsert);
apiRouter.get("/api/profile/company", CompanyProfileController.get);
apiRouter.get("/api/profile/candidate", CandidateProfileController.get);
apiRouter.get("/api/profile/disnaker", DisnakerProfileController.get);
apiRouter.get("/api/user/by-id", UserController.getById);

// RBAC management
apiRouter.post("/api/rbac/roles", RbacController.createRole);
apiRouter.get("/api/rbac/roles", RbacController.listRoles);
apiRouter.put("/api/rbac/roles/:id", RbacController.updateRole);
apiRouter.delete("/api/rbac/roles/:id", RbacController.deleteRole);
apiRouter.post("/api/rbac/permissions", RbacController.createPermission);
apiRouter.get("/api/rbac/permissions", RbacController.listPermissions);
apiRouter.post("/api/rbac/roles/:id/permissions", RbacController.assignRolePermissions);
apiRouter.get("/api/rbac/roles/:id/permissions", RbacController.getRolePermissions);
apiRouter.post("/api/rbac/users/assign-role", RbacController.assignUserRole);

// jobs
apiRouter.post("/api/jobs", requirePermission("lowongan.create"), JobsController.create);
apiRouter.get("/api/jobs", requirePermission("lowongan.read"), JobsController.list);
apiRouter.get("/api/jobs/:id", requirePermission("lowongan.read"), JobsController.get);
apiRouter.put("/api/jobs/:id", requirePermission("lowongan.update"), JobsController.update);
apiRouter.post("/api/jobs/:id/approve", requirePermission("lowongan.verify"), JobsController.approve);
apiRouter.post("/api/jobs/:id/reject", requirePermission("lowongan.verify"), JobsController.reject);
apiRouter.post("/api/jobs/:id/close", requirePermission("lowongan.update"), JobsController.close);
apiRouter.delete("/api/jobs/:id", requirePermission("lowongan.delete"), JobsController.delete);

// job applications
apiRouter.post("/api/jobs/apply", requirePermission("lowongan.read"), JobApplicationController.apply);
apiRouter.get("/api/jobs/applications", requirePermission("lowongan.read"), JobApplicationController.list);
apiRouter.put("/api/jobs/applications/:id", requirePermission("lowongan.update"), JobApplicationController.update);
apiRouter.delete("/api/jobs/applications/:id", requirePermission("lowongan.delete"), JobApplicationController.delete);
