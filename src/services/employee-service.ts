import { prismaClient } from "../app/database";
import logger from "../app/logging";
import HitungTanggalSelesai from "../helper/contract/hitung-tanggal-selesai";
import { ContractData } from "../models/contract-model";
import { CreateEmployeeRequest, EmployeeData, EmployeeResponse, UpdateEmployeeRequest } from "../models/employe-model";
import { EmployeeValidation } from "../validations/employee-validation";
import { Validation } from "../validations/validation";

export default class EmployeeService {
  static async create(request: CreateEmployeeRequest): Promise<EmployeeResponse> {
    // validate request
    const validatedRequest = Validation.validate(EmployeeValidation.CREATE, request);

    //  data
    const record: CreateEmployeeRequest = {
      ...validatedRequest,
    };

    // checking unique NIK
    const checkUnique = await prismaClient.employees.findFirst({
      where: {
        NIK: record.NIK,
      },
    });

    if (checkUnique) {
      throw new Error("NIK anda sudah terdaftar");
    }

    await prismaClient.$transaction(async (tx) => {
      // 1. create employee
      const employee = await tx.employees.create({
        data: {
          NIK: record.NIK,
          kode_jabatan: record.kode_jabatan,
          kode_divisi: record.kode_divisi,
          id_perusahaan: record.id_perusahaan,
          nama: record.nama,
        },
      });

      // 2. hitung tanggal selesai
      const tgl_selesai = HitungTanggalSelesai(new Date(record.tgl_mulai), record.masa_kontrak);

      // 3. create contract
      await tx.contracts.create({
        data: {
          id_karyawan: employee.id_karyawan,
          tgl_mulai: new Date(record.tgl_mulai),
          masa_kontrak: record.masa_kontrak,
          kontrak_file: record.kontrak_file,
          status_kontrak: "PKWT_1",
          tgl_selesai,
        },
      });
    });

    return {
      message: "Employee created successfully",
    };
  }

  static async update(request: UpdateEmployeeRequest): Promise<EmployeeResponse> {
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
        NOT: {
          NIK: record.NIK,
        },
      },
    });

    if (checkUnique) {
      throw new Error("NIK already exist");
    }

    const employee = await prismaClient.employees.update({
      where: {
        NIK: record.NIK,
      },
      data: record,
    });

    logger.error("update data employee: %o", employee);

    return {
      message: "Employee updated successfully",
    };
  }
}
