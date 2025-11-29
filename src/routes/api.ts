import e from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { CompanyProfileController } from "../controllers/company-profile-controller";
import { CandidateProfileController } from "../controllers/candidate-profile-controller";
import { DisnakerProfileController } from "../controllers/disnaker-profile-controller";
import { UserController } from "../controllers/user-controller";
import { RbacController } from "../controllers/rbac-controller";
import { JobsController } from "../controllers/jobs-controller";
import { JobApplicationController } from "../controllers/job-application-controller";
import { requirePermission, requireSelfOrPermission, requireRole } from "../middleware/rbac-middleware";
import { CandidateAk1Controller } from "../controllers/candidate-ak1-controller";
import { UploadController } from "../controllers/upload-controller";

export const apiRouter = e.Router();
apiRouter.use(authMiddleware);


// profile apis
apiRouter.post("/api/profile/company/upsert", requireSelfOrPermission("perusahaan.update"), CompanyProfileController.upsert);
apiRouter.post("/api/profile/candidate/upsert", requireSelfOrPermission("pencaker.update"), CandidateProfileController.upsert);
apiRouter.post("/api/profile/disnaker/upsert", DisnakerProfileController.upsert);
apiRouter.get("/api/profile/company", CompanyProfileController.get);
apiRouter.get("/api/profile/candidate", CandidateProfileController.get);
apiRouter.get("/api/profile/disnaker", DisnakerProfileController.get);

// candidate AK1
apiRouter.post("/api/profile/candidate/ak1/document/upsert", requireSelfOrPermission("ak1.submit"), CandidateAk1Controller.upsertDocument);
apiRouter.get("/api/profile/candidate/ak1/document", requireSelfOrPermission("ak1.read"), CandidateAk1Controller.getDocument);
apiRouter.post("/api/profile/candidate/ak1/verify", requirePermission("ak1.verify"), CandidateAk1Controller.verify);
apiRouter.get("/api/profile/candidate/ak1/documents", requirePermission("pencaker.read"), CandidateAk1Controller.list);

// uploads - generic (ak1 and others)
apiRouter.post("/api/uploads/presign", requireSelfOrPermission("ak1.submit"), UploadController.presign);
// uploads - profiles
apiRouter.post("/api/uploads/presign/candidate", requireSelfOrPermission("pencaker.update"), UploadController.presignCandidate);
apiRouter.post("/api/uploads/presign/company", requireSelfOrPermission("perusahaan.update"), UploadController.presignCompany);
apiRouter.post("/api/uploads/presign/disnaker", requireRole(["disnaker", "super_admin"]), UploadController.presignDisnaker);
apiRouter.get("/api/user/by-id", UserController.getById);
apiRouter.get("/api/users", requirePermission("users.read"), UserController.list);
apiRouter.put("/api/users/:id", requirePermission("users.update"), UserController.update);
apiRouter.delete("/api/users/:id", requirePermission("users.delete"), UserController.delete);

// candidates listing
apiRouter.get("/api/candidates", requirePermission("pencaker.read"), CandidateProfileController.list);

// candidates CRUD
apiRouter.post("/api/candidates", requirePermission("pencaker.create"), CandidateProfileController.create);
apiRouter.get("/api/candidates/:id", requirePermission("pencaker.read"), CandidateProfileController.get);
apiRouter.put("/api/candidates/:id", requirePermission("pencaker.update"), CandidateProfileController.update);
apiRouter.delete("/api/candidates/:id", requirePermission("pencaker.delete"), CandidateProfileController.delete);

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

// companies management
apiRouter.get("/api/companies", requirePermission("perusahaan.read"), CompanyProfileController.list);
apiRouter.get("/api/companies/:id", requirePermission("perusahaan.read"), CompanyProfileController.get);
apiRouter.post("/api/companies", requirePermission("perusahaan.create"), CompanyProfileController.create);
apiRouter.put("/api/companies/:id", requirePermission("perusahaan.update"), CompanyProfileController.update);
apiRouter.delete("/api/companies/:id", requirePermission("perusahaan.delete"), CompanyProfileController.delete);
apiRouter.post("/api/companies/:id/approve", requirePermission("perusahaan.verify"), CompanyProfileController.approve);
apiRouter.post("/api/companies/:id/reject", requirePermission("perusahaan.verify"), CompanyProfileController.reject);
