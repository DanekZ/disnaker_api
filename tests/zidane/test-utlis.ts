import { prismaClient } from "../../src/app/database";
import logger from "../../src/app/logging";
import bcrypt from "bcrypt";
import { AdminDivisions, CompanyStatus, UserRole } from "../../src/generated/prisma/enums";

export class CompanyUtils {
  static async createCompany() {
    const user = await UserUtils.createUser("1");
    const adminUser = await DisnakerUtils.createDisnakerAdmin();

    const user_company = await prismaClient.company_profile.create({
      data: {
        user_id: user.id,
        company_name: "Test Company 1",
        company_logo: "logo1.jpg",
        no_handphone: "081234567890",
        province: "kalimantan timmur",
        city: "samarinda",
        address: "Jl. Test 123",
        website: "www.testcompany1.com",
        about_company: "Test Company 1 adalah perusahaan yang bergerak di bidang teknologi.",
        status: CompanyStatus.APPROVED,
        disnaker_id: adminUser.id,
      },
    });
    return user_company;
  }

  static async deleteCompany() {
    await prismaClient.company_profile.deleteMany({});
  }
}

export class UserUtils {
  static async createUser(no_username: string) {
    const user = await prismaClient.users.create({
      data: {
        username: "user " + no_username,
        email: "user" + no_username + "@example.com",
        password: await bcrypt.hash("123456", 10),
        role: UserRole.COMPANY,
      },
    });
    return user;
  }

  static async deleteUser() {
    await prismaClient.users.deleteMany({});
  }
}

export class DisnakerUtils {
  static async createDisnakerAdmin() {
    const user = await UserUtils.createUser("3");
    const adminDisnaker = await prismaClient.disnaker_profile.create({
      data: {
        user_id: user.id,

        divisi: AdminDivisions.ADMINPKWT,
        full_name: "Disnaker 1",
      },
    });
    return adminDisnaker;
  }

  static async deleteAdmin() {
    await prismaClient.disnaker_profile.deleteMany({});
  }
}

export class JabatanUtils {
  static async createJabatanAndDivisi() {
    const company = await CompanyUtils.createCompany();
    const jabatan = await prismaClient.positions.create({
      data: {
        nama: "jabatan 1",
        company_id: company.id,
      },
    });
    const divisi = await prismaClient.divisions.create({
      data: {
        nama: "divisi 1",
        company_id: company.id,
      },
    });
    return { divisi, jabatan };
  }

  static async deleteJabatan() {
    await prismaClient.positions.deleteMany({});
  }
}

export class DivisiUtils {
  static async createDivisi() {
    const company = await CompanyUtils.createCompany();
    const divisi = await prismaClient.divisions.create({
      data: {
        nama: "divisi 1",
        company_id: company.id,
      },
    });
    return divisi;
  }

  static async deleteDivisi() {
    await prismaClient.divisions.deleteMany({});
  }
}

export class EmployeeUtils {
  static async deleteEmployee() {
    await prismaClient.employees.deleteMany({});
  }

  static async createEmployee() {
    const { divisi, jabatan } = await JabatanUtils.createJabatanAndDivisi();

    await prismaClient.employees.create({
      data: {
        NIK: "1234567890",
        nama: "Zidane",
        kode_divisi: divisi.id,
        kode_jabatan: jabatan.id,
        id_perusahaan: divisi.company_id,
        status: "baru",
      },
    });
  }

  static async deleteAll() {
    await EmployeeUtils.deleteEmployee();
    await JabatanUtils.deleteJabatan();
    await DivisiUtils.deleteDivisi();
    await CompanyUtils.deleteCompany();
    await DisnakerUtils.deleteAdmin();
    await UserUtils.deleteUser();
  }
}
