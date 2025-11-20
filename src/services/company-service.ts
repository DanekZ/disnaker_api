import { prismaClient } from "../app/database";
import logger from "../app/logging";
import { LoginCompanyRequest, RegisterCompanyRequest } from "../models/company-model";
import { CompanyValidation } from "../validations/company-validation";
import { Validation } from "../validations/validation";
import bcrypt from "bcrypt";

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
    const companyRole = await prismaClient.app_roles.findUnique({ where: { name: "company" } });
    const user = await prismaClient.users.create({
      data: {
        username: registerRequest.username,
        password: hashedPassword,
        email: registerRequest.email,
        role_ref_id: companyRole?.id!,
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

    //  if user valid
    const userWithRole = await prismaClient.users.findUnique({ where: { id: user.id }, include: { role_ref: true } });
    return {
      id: userWithRole!.id,
      username: userWithRole!.username,
      role: (userWithRole!.role_ref?.name ?? "company") as any,
    };
  }
}
