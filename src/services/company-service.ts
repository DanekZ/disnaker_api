import { prismaClient } from "../app/database";
import logger from "../app/logging";
import { CreateDivisionRequest, CreatePositionRequest, LoginCompanyRequest, RegisterCompanyRequest, UpdateDivisionRequest, UpdatePositionRequest } from "../models/company-model";
import { CompanyValidation } from "../validations/company-validation";
import { Validation } from "../validations/validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class CompanyService {
  static async register(req: RegisterCompanyRequest) {
    // validate request
    const registerRequest = Validation.validate(CompanyValidation.REGISTER, req);
    logger.error("Data Validasi Register Request", registerRequest);

    //  check if username already exists
    const existingUser = await prismaClient.users.findFirst({
      where: {
        username: registerRequest.username,
      },
    });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    //  check if password and confirm password match
    if (registerRequest.password !== registerRequest.confirm_password) {
      throw new Error("Password and confirm password must match");
    }

    //  hash password
    const hashedPassword = await bcrypt.hash(registerRequest.password, 10);
    logger.error("Hashed Password", hashedPassword);

    //  create user
    const user = await prismaClient.users.create({
      data: {
        username: registerRequest.username,
        password: hashedPassword,
        email: registerRequest.email,
        role: "COMPANY",
      },
    });

    // create company profile
    await prismaClient.company_profile.create({
      data: {
        user_id: user.id,
        company_name: registerRequest.company_name,
        no_handphone: registerRequest.no_handphone,
        province: registerRequest.province,
        city: registerRequest.city,
        address: registerRequest.address,
        about_company: registerRequest.about_company,
      },
    });

    return {
      message: "User Successfully Created",
    };
  }

  static async login(req: LoginCompanyRequest) {
    // validate requestt
    const loginRequest = Validation.validate(CompanyValidation.LOGIN, req);
    logger.error("Data Validasi Login Request", loginRequest);

    //  get user for checking
    let user = await prismaClient.users.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    //  if user not found
    if (!user) {
      throw new Error("Username or password is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    //  if user not valid
    if (!isPasswordValid) {
      throw new Error("Username or password is incorrect");
    }

    const company = await prismaClient.company_profile.findFirst({
      where: {
        user_id: user.id,
      },
    });

    // buat jwt token
    const token = jwt.sign(
      {
        id: user.id,
        company_id: company?.id || "",
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );

    //  if user valid
    return {
      token,
      message: "login berhasil",
    };
  }

  static async getPosition(companyId: string) {
    //  get positions
    const positions = await prismaClient.positions.findMany({
      where: {
        company_id: companyId,
      },
    });

    return positions;
  }

  static async createPosition(companyId: string, req: CreatePositionRequest) {
    // validate request
    const createPositionRequest = Validation.validate(CompanyValidation.CREATE_POSITION, req);

    //  check if position exists
    const existingPosition = await prismaClient.positions.findFirst({
      where: {
        nama: createPositionRequest.nama,
        company_id: companyId,
      },
    });

    if (existingPosition) {
      throw new Error("Position already exists");
    }

    //  create position
    await prismaClient.positions.create({
      data: {
        nama: createPositionRequest.nama,
        company_id: companyId,
      },
    });

    return {
      message: "Position Successfully Created",
    };
  }

  static async updatePosition(companyId: string, positionId: number, req: UpdatePositionRequest) {
    // validate request
    const updatePositionRequest = Validation.validate(CompanyValidation.UPDATE_POSITION, req);

    //  check if position exists
    const existingPosition = await prismaClient.positions.findFirst({
      where: {
        nama: updatePositionRequest.nama,
        company_id: companyId,
        NOT: { id: positionId },
      },
    });

    if (existingPosition) {
      throw new Error("Position already exists");
    }

    //  update position
    await prismaClient.positions.update({
      where: {
        id: positionId,
        company_id: companyId,
      },
      data: {
        nama: updatePositionRequest.nama,
      },
    });

    return {
      message: "Position Successfully Updated",
    };
  }

  static async deletePosition(companyId: string, positionId: number) {
    //  delete position
    await prismaClient.positions.delete({
      where: {
        id: positionId,
        company_id: companyId,
      },
    });

    return {
      message: "Position Successfully Deleted",
    };
  }

  static async getDivision(companyId: string) {
    //  get divisions
    const divisions = await prismaClient.divisions.findMany({
      where: {
        company_id: companyId,
      },
    });

    return divisions;
  }

  static async createDivision(companyId: string, req: CreateDivisionRequest) {
    // validate request
    const createDivisionRequest = Validation.validate(CompanyValidation.CREATE_DIVISION, req);

    //  check if division exists
    const existingDivision = await prismaClient.divisions.findFirst({
      where: {
        nama: createDivisionRequest.nama,
        company_id: companyId,
      },
    });

    if (existingDivision) {
      throw new Error("Division already exists");
    }

    //  create division
    await prismaClient.divisions.create({
      data: {
        nama: createDivisionRequest.nama,
        company_id: companyId,
      },
    });

    return {
      message: "Division Successfully Created",
    };
  }

  static async updateDivision(companyId: string, divisionId: number, req: UpdateDivisionRequest) {
    // validate request
    const updateDivisionRequest = Validation.validate(CompanyValidation.UPDATE_DIVISION, req);

    //  check if division exists
    const existingDivision = await prismaClient.divisions.findFirst({
      where: {
        nama: updateDivisionRequest.nama,
        company_id: companyId,
        NOT: { id: divisionId },
      },
    });

    if (existingDivision) {
      throw new Error("Division already exists");
    }

    //  update division
    await prismaClient.divisions.update({
      where: {
        id: divisionId,
        company_id: companyId,
      },
      data: {
        nama: updateDivisionRequest.nama,
      },
    });

    return {
      message: "Division Successfully Updated",
    };
  }

  static async deleteDivision(companyId: string, divisionId: number) {
    //  delete division
    await prismaClient.divisions.delete({
      where: {
        id: divisionId,
        company_id: companyId,
      },
    });

    return {
      message: "Division Successfully Deleted",
    };
  }
}
