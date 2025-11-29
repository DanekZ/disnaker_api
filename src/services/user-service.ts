import { query } from "../app/database";
import { Validation } from "../validations/validation";
import { UserValidation } from "../validations/user-validation";
import { LoginUserRequest, RegisterUserRequest, UserAuthResponse, UserRoleInput } from "../models/user-model";
import bcrypt from "bcrypt";
import { ResponseError } from "../errors/response-error";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

function mapRoleToAppRoleName(role: UserRoleInput): "candidate" | "company" | "super_admin" {
  if (role === "candidate") return "candidate";
  if (role === "company") return "company";
  return "super_admin";
}

export default class UserService {
  static async register(request: RegisterUserRequest): Promise<UserAuthResponse> {
    const data = Validation.validate(UserValidation.REGISTER, request);
    const existsRows = await query<{ cnt: number }>("SELECT COUNT(*) as cnt FROM users WHERE email = ?", [data.email]);
    const exists = existsRows[0]?.cnt || 0;
    if (exists !== 0) throw new ResponseError(400, "email already exist");
    const hashed = await bcrypt.hash(data.password, 10);
    const username = data.email.split("@")[0];
    const appRoleName = mapRoleToAppRoleName(data.role);
    const roleRows = await query<{ id: number }>("SELECT id FROM app_roles WHERE name = ?", [appRoleName]);
    const roleId = roleRows[0]?.id;
    const id = uuid();
    await query(
      "INSERT INTO users (id, email, username, password, role_ref_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [id, data.email, username, hashed, roleId]
    );
    const user = { id, email: data.email } as any;
    const secret = process.env.JWT_SECRET || "dev-secret";
    const token = jwt.sign({ id: user.id, email: user.email, role: data.role }, secret, { subject: user.id, expiresIn: "7d" });
    return { message: "User registered successfully", id: user.id, role: data.role, token };
  }

  static async login(request: LoginUserRequest): Promise<UserAuthResponse> {
    const data = Validation.validate(UserValidation.LOGIN, request);
    const rows = await query<any>(
      "SELECT u.*, r.name as role_name FROM users u LEFT JOIN app_roles r ON u.role_ref_id = r.id WHERE u.email = ? LIMIT 1",
      [data.email]
    );
    const user = rows[0];
    if (!user) throw new ResponseError(400, "email or password is wrong");
    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) throw new ResponseError(400, "email or password is wrong");
    const role = (user.role_name === "candidate" ? "candidate" : user.role_name === "company" ? "company" : "super_admin") as UserRoleInput;
    const secret = process.env.JWT_SECRET || "dev-secret";
    const token = jwt.sign({ id: user.id, email: user.email, role }, secret, { subject: user.id, expiresIn: "7d" });
    return { message: "User logged in successfully", id: user.id, role, token };
  }

  static async getById(id: string) {
    const rows = await query<any>(
      "SELECT u.id, u.email, r.name as role_name FROM users u LEFT JOIN app_roles r ON u.role_ref_id = r.id WHERE u.id = ? LIMIT 1",
      [id]
    );
    const user = rows[0];
    if (!user) throw new ResponseError(404, "user not found");
    const role = (user.role_name === "candidate" ? "candidate" : user.role_name === "company" ? "company" : "super_admin") as UserRoleInput;
    return { data: { id: user.id, email: user.email, role } };
  }

  static async list(opts?: { page?: number; limit?: number }) {
    const page = Math.max(1, Number(opts?.page || 1));
    const limit = Math.max(1, Number(opts?.limit || 10));
    const totalRows = await query<{ cnt: number }>("SELECT COUNT(*) as cnt FROM users", []);
    const total = totalRows[0]?.cnt || 0;
    const rows = await query<any>(
      "SELECT u.*, r.name as role_name FROM users u LEFT JOIN app_roles r ON u.role_ref_id = r.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?",
      [limit, (page - 1) * limit]
    );
    const data = rows.map((u: any) => ({ id: u.id, email: u.email, username: u.username, role: (u.role_name === "candidate" ? "candidate" : u.role_name === "company" ? "company" : "super_admin") as UserRoleInput, createdAt: u.created_at, updatedAt: u.updated_at }));
    return { data, pagination: { page, limit, total } };
  }

  static async update(id: string, req: { email?: string; username?: string; role?: UserRoleInput; password?: string }) {
    const rows = await query<any>("SELECT * FROM users WHERE id = ?", [id]);
    const user = rows[0];
    if (!user) throw new ResponseError(404, "user not found");
    const data: any = {};
    if (req.email && req.email !== user.email) {
      const existsRows = await query<{ cnt: number }>("SELECT COUNT(*) as cnt FROM users WHERE email = ?", [req.email]);
      const exists = existsRows[0]?.cnt || 0;
      if (exists) throw new ResponseError(400, "email already exist");
      data.email = req.email;
    }
    if (req.username && req.username !== user.username) {
      const existsURows = await query<{ cnt: number }>("SELECT COUNT(*) as cnt FROM users WHERE username = ?", [req.username]);
      const existsU = existsURows[0]?.cnt || 0;
      if (existsU) throw new ResponseError(400, "username already exist");
      data.username = req.username;
    }
    if (req.password) {
      data.password = await bcrypt.hash(req.password, 10);
    }
    if (req.role) {
      const roleName = req.role === 'super_admin' ? 'super_admin' : req.role;
      const rRows = await query<{ id: number }>("SELECT id FROM app_roles WHERE name = ?", [roleName as any]);
      const appRoleId = rRows[0]?.id;
      if (appRoleId) data.role_ref_id = appRoleId;
    }
    const fields = Object.keys(data);
    if (fields.length > 0) {
      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = fields.map((f) => (data as any)[f]);
      await query(`UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?`, [...values, id]);
    }
    const updatedRows = await query<any>("SELECT u.*, r.name as role_name FROM users u LEFT JOIN app_roles r ON u.role_ref_id = r.id WHERE u.id = ?", [id]);
    const updated = updatedRows[0];
    const role = (updated.role_name === "candidate" ? "candidate" : updated.role_name === "company" ? "company" : "super_admin") as UserRoleInput;
    return { message: "updated", data: { id: updated.id, email: updated.email, username: updated.username, role } };
  }

  static async delete(id: string) {
    await query("DELETE FROM users WHERE id = ?", [id]);
    return { message: "deleted" };
  }
}
