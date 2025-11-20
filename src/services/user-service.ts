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
}