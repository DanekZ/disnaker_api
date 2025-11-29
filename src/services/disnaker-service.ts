import { CreateDisnakerRequest, LoginDisnakerRequest, UserData } from "../models/disnaker-model";
import { Validation } from "../validations/validation";
import { DisnakerValidation } from "../validations/disnaker-validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../errors/response-error";
import bcrypt from "bcrypt";
import logger from "../app/logging";
import { ContractStatus, UserRole } from "../generated/prisma/enums";
import jwt from "jsonwebtoken";

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
  static async login(request: LoginDisnakerRequest): Promise<{ token: string; message: string }> {
    const loginRequest = Validation.validate(DisnakerValidation.LOGIN, request);
    let user = await prismaClient.users.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(400, "username atau password salah");
    }

    const disnaker_id = await prismaClient.disnaker_profile.findFirst({
      where: { user_id: user.id },
      select: { id: true },
    });

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    logger.error("isPasswordValid: %o", { isPasswordValid });

    if (!isPasswordValid) {
      throw new ResponseError(400, "username atau password salah");
    }

    // buat jwt token
    const token = jwt.sign(
      {
        id: user.id,
        disnaker_id: disnaker_id?.id || "",
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );

    return {
      token,
      message: "Login Berhasil",
    };
  }

  static async getContracts(request: ContractStatus) {
    const data = await prismaClient.contracts.findMany({
      where: {
        status_persetujuan: request,
      },
    });

    if (!data) throw new Error("Data tidak ditemukan!");

    return {
      data,
    };
  }

  static async approveContract(id_disnaker: string, id_contract: string) {
    // cari data
    const contract = await prismaClient.contracts.findUnique({
      where: { id: id_contract },
    });

    if (!contract) throw new ResponseError(400, "Kontrak tidak ditemukan");

    if (contract.status_persetujuan == ContractStatus.disetujui) throw new ResponseError(400, "Kontrak telah disetujui");

    // update kontrak untuk disetujui
    await prismaClient.contracts.update({
      where: { id: id_contract },
      data: {
        status_persetujuan: ContractStatus.disetujui,
        id_disnaker: id_disnaker,
      },
    });

    // Hitung masa kontrak yang sudah disetujui
    const approvedContract = await prismaClient.contracts.findMany({
      where: {
        id_karyawan: contract.id_karyawan,
        status_persetujuan: "disetujui",
      },
      select: {
        masa_kontrak: true,
      },
    });

    const totalBulan = approvedContract.reduce((a, b) => a + b.masa_kontrak, 0);

    // Tentukan status karyawan
    let employesStatus = `PKWT-${approvedContract.length}`;

    if (totalBulan >= 60) {
      employesStatus = "PKWT-T"; //permanen
    }

    // update status employe
    await prismaClient.employees.update({
      where: { id_karyawan: contract.id_karyawan },
      data: { status: employesStatus },
    });

    return {
      message: "kontrak telah disetujui",
    };
  }

  static async rejectContract(id_disnaker: string, id_contract: string, pesan: string) {
    const contract = await prismaClient.contracts.findUnique({
      where: { id: id_contract },
    });

    if (!contract) throw new ResponseError(400, "Kontrak tidak ditemukan");

    if (contract.status_persetujuan !== "pending") throw new ResponseError(400, "Kontrak sudah pernah diproses sebelumnya");

    await prismaClient.contracts.update({
      where: { id: id_contract },
      data: {
        status_persetujuan: "ditolak",
        pesan: pesan,
        id_disnaker: id_disnaker,
      },
    });

    return { message: "kontrak berhasil ditolak" };
  }
}
