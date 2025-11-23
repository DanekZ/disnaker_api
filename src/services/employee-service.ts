import { prismaClient } from "../app/database";
import logger from "../app/logging";
import HitungTanggalSelesai from "../helper/contract/hitung-tanggal-selesai";
import { ContractData } from "../models/contract-model";
import { CreateEmployeeRequest, EmployeeData, EmployeeResponse, UpdateEmployeeRequest } from "../models/employe-model";
import { EmployeeValidation } from "../validations/employee-validation";
import { Validation } from "../validations/validation";

export default class EmployeeService {
  static async getDetail(employee_id: string) {
    const result = await prismaClient.employees.findFirst({
      where: {
        id_karyawan: employee_id,
      },
    });

    if (!result) throw new Error("Data karyawan tidak ditemukan");

    return result;
  }

  static async get(company_id: string): Promise<EmployeeData[]> {
    const result = await prismaClient.employees.findMany({
      where: {
        id_perusahaan: company_id,
      },
    });

    if (!result) {
      throw new Error("Data karyawan tidak ditemukan");
    }

    return result;
  }

  static async create(company_id: string, request: CreateEmployeeRequest): Promise<EmployeeResponse> {
    // validate request
    const validatedRequest = Validation.validate(EmployeeValidation.CREATE, request);

    //  data
    const record: CreateEmployeeRequest = {
      ...validatedRequest,
      id_perusahaan: company_id,
    };

    // checking unique NIK
    const checkUnique = await prismaClient.employees.findFirst({
      where: {
        NIK: record.NIK,
        id_perusahaan: company_id,
      },
    });

    if (checkUnique) {
      throw new Error("NIK anda sudah terdaftar");
    }

    // 1. create employee
    await prismaClient.employees.create({
      data: {
        NIK: record.NIK,
        kode_jabatan: record.kode_jabatan,
        kode_divisi: record.kode_divisi,
        id_perusahaan: record.id_perusahaan,
        nama: record.nama,
      },
    });

    return {
      message: "Employee created successfully",
    };
  }

  static async update(employee_id: string, request: UpdateEmployeeRequest): Promise<EmployeeResponse> {
    // validate request
    const validatedRequest = Validation.validate(EmployeeValidation.UPDATE, request);

    // create data
    const record: UpdateEmployeeRequest = {
      ...validatedRequest,
    };

    // checking unique NIK
    const checkUnique = await prismaClient.employees.findFirst({
      where: {
        NIK: record.NIK,
        id_karyawan: {
          not: employee_id,
        },
      },
    });

    if (checkUnique) {
      throw new Error("NIK already exist");
    }

    await prismaClient.employees.update({
      where: {
        id_karyawan: employee_id,
      },
      data: record,
    });

    return {
      message: "Employee updated successfully",
    };
  }

  static async delete(employee_id: string): Promise<EmployeeResponse> {
    const checkUnique = await prismaClient.employees.delete({
      where: {
        id_karyawan: employee_id,
      },
    });

    if (!checkUnique) {
      throw new Error("Data karyawan gagal dihapus");
    }

    return {
      message: "Employee deleted successfully",
    };
  }
}
