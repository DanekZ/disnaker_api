import { prismaClient } from "../app/database";
import logger from "../app/logging";
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
      NIK: validatedRequest.NIK,
      nama: validatedRequest.nama,
      kode_divisi: validatedRequest.kode_divisi,
      kode_jabatan: validatedRequest.kode_jabatan,
      id_perusahaan: validatedRequest.id_perusahaan,
      status: "PKWT_1",
      tgl_mulai: validatedRequest.tgl_mulai,
      masa_kontrak: validatedRequest.masa_kontrak,
    };

    // checking unique NIK
    const checkUnique = await prismaClient.employees.findFirst({
      where: {
        NIK: record.NIK,
      },
    });

    if (checkUnique) {
      throw new Error("NIK already exist");
    }

    // data karyawan
    const employeeData: EmployeeData = {
      NIK: record.NIK,
      kode_jabatan: record.kode_jabatan,
      kode_divisi: record.kode_divisi,
      id_perusahaan: record.id_perusahaan,
      nama: record.nama,
      status: record.status,
    };

    // create employee
    await prismaClient.employees.create({
      data: employeeData,
    });

    const employe = await prismaClient.employees.findFirst({
      where: {
        NIK: record.NIK,
      },
    });

    const current = employe?.status;
    const requested = record.status;
    // status bisa jadi: "PKWT 1" | "PKWT 2" | "permanent"

    // Sudah permanent tidak boleh diubah
    if (current == "permanent") throw new Error("Karyawan sudah permanent, tidak bisa membuat kontrak baru.");

    // mau pkwt 1 tapi sudah pernah pkwt 1
    // if (requested == "PKWT_1" && current == "PKWT_1") throw new Error("Karyawan sudah pernah PKWT 1, tidak bisa membuat kontrak PKWT 1 lagi.");

    // mau pkwt 2 tapi sebelumnya bukan pkwt 1
    if (requested == "PKWT_2" && current != "PKWT_1") throw new Error("Karyawan harus memiliki kontrak PKWT 1 terlebih dahulu sebelum membuat kontrak PKWT 2.");

    // mau pkwt 2 lagi padahal sebelumnya sudah pkwt 2
    if (requested == "PKWT_2" && current == "PKWT_2") throw new Error("Karyawan sudah pernah PKWT 2, tidak bisa membuat kontrak PKWT 2 lagi.");

    const contractData: ContractData = {
      id_karyawan: employe?.id_karyawan || "",
      tgl_mulai: new Date(record.tgl_mulai),
      masa_kontrak: record.masa_kontrak,
    };

    // checking contract status

    const contract = await prismaClient.contracts.create({
      data: contractData,
    });

    logger.error("create data contract: %o", contract);

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
