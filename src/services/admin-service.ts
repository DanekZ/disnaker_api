import { AdminData, AdminResponse, CreateAdminRequest } from "../models/admin-model";
import { Validation } from "../validations/validation";
import { AdminValidation } from "../validations/admin-validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../errors/response-error";
import bcrypt from "bcrypt";
import logger from "../app/logging";

export default class AdminService {
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
}
