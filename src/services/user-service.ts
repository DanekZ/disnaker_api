import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { UserValidation } from "../validations/user-validation";
import { LoginUserRequest, RegisterUserRequest, UserAuthResponse, UserRoleInput } from "../models/user-model";
import bcrypt from "bcrypt";
import { ResponseError } from "../errors/response-error";

function toRoleInputLegacy(role: string): UserRoleInput {
  if (role.toLowerCase() === "candidate") return "candidate";
  if (role.toLowerCase() === "company") return "company";
  return "super_admin";
}

function mapRoleToAppRoleName(role: UserRoleInput): "candidate" | "company" | "super_admin" {
  if (role === "candidate") return "candidate";
  if (role === "company") return "company";
  return "super_admin";
}

function resolveRoleFromUser(user: any): UserRoleInput {
  const refName = (user?.role_ref as any)?.name as string | undefined;
  if (refName) {
    if (refName === "candidate") return "candidate";
    if (refName === "company") return "company";
    return "super_admin";
  }
  return toRoleInputLegacy((user as any).role as unknown as string);
}

export default class UserService {
  static async register(request: RegisterUserRequest): Promise<UserAuthResponse> {
    const data = Validation.validate(UserValidation.REGISTER, request);
    const exists = await prismaClient.users.count({ where: { email: data.email } });
    if (exists !== 0) throw new ResponseError(400, "email already exist");
    const hashed = await bcrypt.hash(data.password, 10);
    const username = data.email.split("@")[0];
    const appRoleName = mapRoleToAppRoleName(data.role);
    const appRole = await prismaClient.app_roles.findUnique({ where: { name: appRoleName } });
    const user = await prismaClient.users.create({
      data: { email: data.email, username, password: hashed, role_ref_id: appRole?.id! },
    });
    return { message: "User registered successfully", id: user.id, role: data.role };
  }

  static async login(request: LoginUserRequest): Promise<UserAuthResponse> {
    const data = Validation.validate(UserValidation.LOGIN, request);
    const user = await prismaClient.users.findFirst({ where: { email: data.email }, include: { role_ref: true } });
    if (!user) throw new ResponseError(400, "email or password is wrong");
    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) throw new ResponseError(400, "email or password is wrong");
    return { message: "User logged in successfully", id: user.id, role: resolveRoleFromUser(user) };
  }

  static async getById(id: string) {
    const user = await prismaClient.users.findUnique({ where: { id }, include: { role_ref: true } });
    if (!user) throw new ResponseError(404, "user not found");
    return { data: { id: user.id, email: user.email, role: resolveRoleFromUser(user) } };
  }

  static async list(query?: { page?: number; limit?: number }) {
    const page = Math.max(1, Number(query?.page || 1));
    const limit = Math.max(1, Number(query?.limit || 10));
    const total = await prismaClient.users.count();
    const rows = await prismaClient.users.findMany({ include: { role_ref: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit });
    const data = rows.map((u: any) => ({ id: u.id, email: u.email, username: u.username, role: resolveRoleFromUser(u), createdAt: u.createdAt, updatedAt: u.updatedAt }));
    return { data, pagination: { page, limit, total } };
  }

  static async update(id: string, req: { email?: string; username?: string; role?: UserRoleInput; password?: string }) {
    const user = await prismaClient.users.findUnique({ where: { id }, include: { role_ref: true } });
    if (!user) throw new ResponseError(404, "user not found");
    const data: any = {};
    if (req.email && req.email !== user.email) {
      const exists = await prismaClient.users.count({ where: { email: req.email } });
      if (exists) throw new ResponseError(400, "email already exist");
      data.email = req.email;
    }
    if (req.username && req.username !== user.username) {
      const existsU = await prismaClient.users.count({ where: { username: req.username } });
      if (existsU) throw new ResponseError(400, "username already exist");
      data.username = req.username;
    }
    if (req.password) {
      data.password = await bcrypt.hash(req.password, 10);
    }
    if (req.role) {
      const roleName = req.role === 'super_admin' ? 'super_admin' : req.role;
      const appRole = await prismaClient.app_roles.findUnique({ where: { name: roleName as any } });
      if (appRole) data.role_ref_id = appRole.id;
    }
    const updated = await prismaClient.users.update({ where: { id }, data });
    return { message: "updated", data: { id: updated.id, email: updated.email, username: updated.username, role: resolveRoleFromUser(updated) } };
  }

  static async delete(id: string) {
    try {
      await prismaClient.users.delete({ where: { id } });
    } catch (e: any) {
      throw new ResponseError(400, "cannot delete user with existing relations");
    }
    return { message: "deleted" };
  }
}
