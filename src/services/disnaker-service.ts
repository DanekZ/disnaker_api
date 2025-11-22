import { CreateDisnakerRequest, LoginDisnakerRequest, UserData } from "../models/disnaker-model";
import { Validation } from "../validations/validation";
import { DisnakerValidation } from "../validations/disnaker-validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../errors/response-error";
import bcrypt from "bcrypt";
import logger from "../app/logging";
import { v4 as uuid } from "uuid";
import { UserRole } from "../generated/prisma/enums";

export default class DisnakerService {
  // register service
  static async register(request: CreateDisnakerRequest) {
    // validasi input
    const registerRequest = Validation.validate(DisnakerValidation.REGISTER, request);
    logger.debug("registerRequest: %o", registerRequest);

    // check password dan confirm password
    if (registerRequest.user.password !== registerRequest.confirm_password) {
      throw new ResponseError(400, "password dan konfirmasi password harus sama");
    }

    // check username apakah sudah ada
    const totalUserWithUsername = await prismaClient.users.count({
      where: {
        username: registerRequest.user.username,
      },
    });

    if (totalUserWithUsername !== 0) {
      throw new ResponseError(400, "username telah digunakan");
    }

    // hashing password data
    registerRequest.user.password = await bcrypt.hash(registerRequest.user.password, 10);

    // buat data user
    const userData: UserData = {
      username: registerRequest.user.username,
      password: registerRequest.user.password,
      email: registerRequest.user.email,
      role: UserRole.DISNAKER,
    };

    const user = await prismaClient.users.create({
      data: userData,
    });

    // buat data disnaker profile
    const disnakerData = {
      user_id: user.id,
      divisi: registerRequest.divisi,
      full_name: registerRequest.full_name,
    };

    await prismaClient.disnaker_profile.create({
      data: disnakerData,
    });

    return {
      message: "Disnaker registered successfully",
    };
  }

  // login service
  static async login(request: LoginDisnakerRequest): Promise<{ message: string }> {
    const loginRequest = Validation.validate(DisnakerValidation.LOGIN, request);
    let user = await prismaClient.users.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(400, "username atau password salah");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    logger.error("isPasswordValid: %o", { isPasswordValid });

    if (!isPasswordValid) {
      throw new ResponseError(400, "username atau password salah");
    }

    return {
      message: "Login Berhasil",
    };
  }
}
