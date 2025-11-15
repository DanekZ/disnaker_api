import { AdminData, AdminResponse, CreateAdminRequest, LoginAdminRequest } from "../models/admin-model";
import { Validation } from "../validations/validation";
import { AdminValidation } from "../validations/admin-validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../errors/response-error";
import bcrypt from "bcrypt";
import logger from "../app/logging";
import { v4 as uuid } from "uuid";

export default class AdminService {
  // register service
  static async register(request: CreateAdminRequest): Promise<AdminResponse> {
    const registerRequest = Validation.validate(AdminValidation.REGISTER, request);
    logger.debug("registerRequest: %o", registerRequest);

    const totalUserWithUsername = await prismaClient.admins.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithUsername !== 0) {
      throw new ResponseError(400, "username already exist");
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const data: AdminData = {
      username: registerRequest.username,
      password: registerRequest.password,
      id_perusahaan: registerRequest.id_perusahaan,
      role: "disnaker",
    };

    logger.error("hasil admin data setelah validasi: %o", registerRequest);

    if (registerRequest.role_code === "PNJMDSKR") {
      data.role = "disnaker";
    } else if (registerRequest.role_code === "PRSHN") {
      data.role = "perusahaan";
    }

    const admin = await prismaClient.admins.create({
      data: data,
    });

    logger.error(admin);

    return {
      message: "Admin registered successfully",
    };
  }

  // login service
  static async login(request: LoginAdminRequest): Promise<AdminResponse> {
    const loginRequest = Validation.validate(AdminValidation.LOGIN, request);
    let user = await prismaClient.admins.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    logger.error("ini user: %o", { user });

    if (!user) {
      throw new ResponseError(400, "username or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    logger.error("isPasswordValid: %o", { isPasswordValid });

    if (!isPasswordValid) {
      throw new ResponseError(400, "username or password is wrong");
    }

    user = await prismaClient.admins.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      message: "Admin logged in successfully",
    };
  }
}
