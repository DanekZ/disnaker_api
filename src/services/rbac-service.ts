import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { RbacValidation } from "../validations/rbac-validation";
import { AssignRolePermissionsRequest, AssignUserRoleRequest, CreatePermissionRequest, CreateRoleRequest, UpdateRoleRequest } from "../models/rbac-model";
import { ResponseError } from "../errors/response-error";

export default class RbacService {
  static async createRole(req: CreateRoleRequest) {
    const data = Validation.validate(RbacValidation.CREATE_ROLE, req);
    const exists = await prismaClient.app_roles.count({ where: { name: data.name } });
    if (exists) throw new ResponseError(400, "role already exist");
    const role = await prismaClient.app_roles.create({ data: { name: data.name, description: data.description } });
    return { data: role };
  }

  static async listRoles() {
    const roles = await prismaClient.app_roles.findMany({ orderBy: { id: "asc" } });
    return { data: roles };
  }

  static async updateRole(req: UpdateRoleRequest) {
    const data = Validation.validate(RbacValidation.UPDATE_ROLE, req);
    const role = await prismaClient.app_roles.findUnique({ where: { id: data.id } });
    if (!role) throw new ResponseError(404, "role not found");
    const updated = await prismaClient.app_roles.update({ where: { id: data.id }, data: { name: data.name ?? role.name, description: data.description ?? role.description } });
    return { data: updated };
  }

  static async deleteRole(id: number) {
    await prismaClient.app_roles.delete({ where: { id } });
    return { message: "deleted" };
  }

  static async createPermission(req: CreatePermissionRequest) {
    const data = Validation.validate(RbacValidation.CREATE_PERMISSION, req);
    const exists = await prismaClient.app_permissions.count({ where: { code: data.code } });
    if (exists) throw new ResponseError(400, "permission already exist");
    const perm = await prismaClient.app_permissions.create({ data: { code: data.code, label: data.label } });
    return { data: perm };
  }

  static async listPermissions() {
    const perms = await prismaClient.app_permissions.findMany({ orderBy: { id: "asc" } });
    return { data: perms };
  }

  static async assignRolePermissions(req: AssignRolePermissionsRequest) {
    const data = Validation.validate(RbacValidation.ASSIGN_ROLE_PERMISSIONS, req);
    const role = await prismaClient.app_roles.findUnique({ where: { id: data.role_id } });
    if (!role) throw new ResponseError(404, "role not found");
    const targetPerms = await prismaClient.app_permissions.findMany({ where: { code: { in: data.permissions } } });
    if (targetPerms.length !== data.permissions.length) throw new ResponseError(400, "invalid permission codes");
    await prismaClient.role_permissions.deleteMany({ where: { role_id: data.role_id } });
    if (targetPerms.length > 0) {
      await prismaClient.role_permissions.createMany({ data: targetPerms.map((p) => ({ role_id: data.role_id, permission_id: p.id })) });
    }
    return { message: "assigned" };
  }

  static async getRolePermissions(role_id: number) {
    const rows = await prismaClient.role_permissions.findMany({ where: { role_id }, include: { permission: true } });
    return { data: rows.map((r) => ({ code: r.permission.code, label: r.permission.label })) };
  }

  static async assignUserRole(req: AssignUserRoleRequest) {
    const data = Validation.validate(RbacValidation.ASSIGN_USER_ROLE, req);
    const role = await prismaClient.app_roles.findUnique({ where: { id: data.role_id } });
    if (!role) throw new ResponseError(404, "role not found");
    const user = await prismaClient.users.findUnique({ where: { id: data.id } });
    if (!user) throw new ResponseError(404, "user not found");
    await prismaClient.users.update({ where: { id: data.id }, data: { role_ref_id: data.role_id } });
    return { message: "assigned" };
  }
}