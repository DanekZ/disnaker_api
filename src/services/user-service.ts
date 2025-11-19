import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { UserValidation } from "../validations/user-validation";
import { LoginUserRequest, RegisterUserRequest, UserAuthResponse, UserRoleInput } from "../models/user-model";
import bcrypt from "bcrypt";
import { ResponseError } from "../errors/response-error";

function mapRole(role: UserRoleInput): "CANDIDATE" | "COMPANY" | "DISNAKER" {
  if (role === "candidate") return "CANDIDATE";
  if (role === "company") return "COMPANY";
  return "DISNAKER";
}

function toRoleInput(role: string): UserRoleInput {
  if (role.toLowerCase() === "candidate") return "candidate";
  if (role.toLowerCase() === "company") return "company";
  return "disnaker";
}

export default class UserService {
  static async register(request: RegisterUserRequest): Promise<UserAuthResponse> {
    const data = Validation.validate(UserValidation.REGISTER, request);
    const exists = await prismaClient.users.count({ where: { email: data.email } });
    if (exists !== 0) throw new ResponseError(400, "email already exist");
    const hashed = await bcrypt.hash(data.password, 10);
    const username = data.email.split("@")[0];
    const user = await prismaClient.users.create({
      data: { email: data.email, username, password: hashed, role: mapRole(data.role) },
    });
    return { message: "User registered successfully", user_id: user.id, role: data.role };
  }

  static async login(request: LoginUserRequest): Promise<UserAuthResponse> {
    const data = Validation.validate(UserValidation.LOGIN, request);
    const user = await prismaClient.users.findFirst({ where: { email: data.email } });
    if (!user) throw new ResponseError(400, "email or password is wrong");
    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) throw new ResponseError(400, "email or password is wrong");
    return { message: "User logged in successfully", user_id: user.id, role: toRoleInput(user.role as unknown as string) };
  }

  static async getById(user_id: string) {
    const user = await prismaClient.users.findUnique({ where: { id: user_id } });
    if (!user) throw new ResponseError(404, "user not found");
    return { data: { user_id: user.id, email: user.email, role: toRoleInput(user.role as unknown as string) } };
  }
}