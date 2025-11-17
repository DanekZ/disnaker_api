import { prismaClient } from "../app/database";
import { LoginCompanyRequest } from "../models/company-model";
import { CompanyValidation } from "../validations/company-validation";
import { Validation } from "../validations/validation";
import bcrypt from "bcrypt";

export default class CompanyService {
  static async login(req: LoginCompanyRequest) {
    const loginRequest = Validation.validate(CompanyValidation.LOGIN, req);

    let user = await prismaClient.users.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new Error("Username or password is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Username or password is incorrect");
    }
  }
}
