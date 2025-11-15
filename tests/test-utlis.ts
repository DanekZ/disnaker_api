import { prismaClient } from "../src/app/database";
import logger from "../src/app/logging";
import bcrypt from "bcrypt";

export class CompanyUtils {
  static async createCompany() {
    const company = await prismaClient.companies.createMany({
      data: [
        {
          nama: "Test Company 1",
          izin: "izin 1",
        },
        {
          nama: "Test Company 2",
          izin: "izin 2",
        },
      ],
    });
    return company;
  }

  static async deleteCompany() {
    await prismaClient.companies.deleteMany({});
  }
}

export class AdminUtils {
  static async createAdmin() {
    const company = await prismaClient.companies.findFirst();
    logger.error("company ini woi", company);
    const admin = await prismaClient.admins.create({
      data: {
        id: 1,
        username: "admin1",
        password: await bcrypt.hash("123456", 10),
        role: "disnaker",
        id_perusahaan: company?.id || 1,
      },
    });
    return admin;
  }

  static async deleteAdmin() {
    await prismaClient.admins.deleteMany({});
  }
}
