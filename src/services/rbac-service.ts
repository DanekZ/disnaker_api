import { query } from "../app/database";
import { Validation } from "../validations/validation";
import { RbacValidation } from "../validations/rbac-validation";
import { AssignRolePermissionsRequest, AssignUserRoleRequest, CreatePermissionRequest, CreateRoleRequest, UpdateRoleRequest } from "../models/rbac-model";
import { ResponseError } from "../errors/response-error";

export default class RbacService {
  static async createRole(req: CreateRoleRequest) {
    const data = Validation.validate(RbacValidation.CREATE_ROLE, req);
    const rows = await query<{ cnt: number }>("SELECT COUNT(*) as cnt FROM app_roles WHERE name = ?", [data.name]);
    const exists = rows[0]?.cnt || 0;
    if (exists) throw new ResponseError(400, "role already exist");
    await query("INSERT INTO app_roles (name, description) VALUES (?, ?)", [data.name, data.description || null]);
    const created = await query<any>("SELECT * FROM app_roles WHERE name = ?", [data.name]);
    return { data: created[0] };
  }

  static async listRoles() {
    const roles = await query<any>("SELECT * FROM app_roles ORDER BY id ASC", []);
    return { data: roles };
  }

  static async updateRole(req: UpdateRoleRequest) {
    const data = Validation.validate(RbacValidation.UPDATE_ROLE, req);
    const rRows = await query<any>("SELECT * FROM app_roles WHERE id = ?", [data.id]);
    const role = rRows[0];
    if (!role) throw new ResponseError(404, "role not found");
    await query("UPDATE app_roles SET name = ?, description = ? WHERE id = ?", [data.name ?? role.name, data.description ?? role.description, data.id]);
    const rows = await query<any>("SELECT * FROM app_roles WHERE id = ?", [data.id]);
    return { data: rows[0] };
  }

  static async deleteRole(id: number) {
    await query("DELETE FROM app_roles WHERE id = ?", [id]);
    return { message: "deleted" };
  }

  static async createPermission(req: CreatePermissionRequest) {
    const data = Validation.validate(RbacValidation.CREATE_PERMISSION, req);
    const rows = await query<{ cnt: number }>("SELECT COUNT(*) as cnt FROM app_permissions WHERE code = ?", [data.code]);
    const exists = rows[0]?.cnt || 0;
    if (exists) throw new ResponseError(400, "permission already exist");
    await query("INSERT INTO app_permissions (code, label) VALUES (?, ?)", [data.code, data.label]);
    const created = await query<any>("SELECT * FROM app_permissions WHERE code = ?", [data.code]);
    return { data: created[0] };
  }

  static async listPermissions() {
    const perms = await query<any>("SELECT * FROM app_permissions ORDER BY id ASC", []);
    return { data: perms };
  }

  static async assignRolePermissions(req: AssignRolePermissionsRequest) {
    const data = Validation.validate(RbacValidation.ASSIGN_ROLE_PERMISSIONS, req);
    const rRows = await query<any>("SELECT * FROM app_roles WHERE id = ?", [data.role_id]);
    const role = rRows[0];
    if (!role) throw new ResponseError(404, "role not found");
    const placeholders = data.permissions.map(() => "?").join(", ");
    const targetPerms = await query<any>(`SELECT * FROM app_permissions WHERE code IN (${placeholders})`, data.permissions);
    if (targetPerms.length !== data.permissions.length) throw new ResponseError(400, "invalid permission codes");
    await query("DELETE FROM role_permissions WHERE role_id = ?", [data.role_id]);
    if (targetPerms.length > 0) {
      const values = targetPerms.map((p: any) => `(${data.role_id}, ${p.id})`).join(", ");
      await query(`INSERT INTO role_permissions (role_id, permission_id) VALUES ${values}`);
    }
    return { message: "assigned" };
  }

  static async getRolePermissions(role_id: number) {
    const rows = await query<any>("SELECT p.code, p.label FROM role_permissions rp LEFT JOIN app_permissions p ON p.id = rp.permission_id WHERE rp.role_id = ?", [role_id]);
    return { data: rows.map((r: any) => ({ code: r.code, label: r.label })) };
  }

  static async assignUserRole(req: AssignUserRoleRequest) {
    const data = Validation.validate(RbacValidation.ASSIGN_USER_ROLE, req);
    const rRows = await query<any>("SELECT * FROM app_roles WHERE id = ?", [data.role_id]);
    const role = rRows[0];
    if (!role) throw new ResponseError(404, "role not found");
    const uRows = await query<any>("SELECT * FROM users WHERE id = ?", [data.id]);
    const user = uRows[0];
    if (!user) throw new ResponseError(404, "user not found");
    await query("UPDATE users SET role_ref_id = ? WHERE id = ?", [data.role_id, data.id]);
    return { message: "assigned" };
  }
}