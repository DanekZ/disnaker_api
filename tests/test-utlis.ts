import { prismaClient } from "../src/app/database";

export class CompanyUtils {
  static async createCompany() {
    const company = await prismaClient.companies.createMany({
      data: [
        {
          id: 1,
          nama: "Test Company 1",
          izin: "izin 1",
        },
        {
          id: 2,
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
    const admin = await prismaClient.admins.createMany({
      data: [
        {
          id: 1,
          username: "admin1",
          password: "123456",
          role: "disnaker",
          id_perusahaan: 1,
        },
      ],
    });
    return admin;
  }

  static async deleteAdmin() {
    await prismaClient.admins.deleteMany({});
  }
}
