import { prismaClient } from "../app/database";
import { ContractStatus } from "../generated/prisma/enums";
import HitungTanggalSelesai from "../helper/contract/hitung-tanggal-selesai";
import { CreateContractRequest, UpdateContractRequest } from "../models/contract-model";
import { ContractValidation } from "../validations/contract-validation";
import { Validation } from "../validations/validation";

export default class ContractService {
  static async create(employee_id: string, request: CreateContractRequest) {
    // validate request
    const validatedRequest = Validation.validate(ContractValidation.CREATE, request);

    // cek kontrak pending
    const pending = await prismaClient.contracts.findFirst({
      where: {
        id_karyawan: employee_id,
        status_persetujuan: ContractStatus.pending,
      },
    });

    if (pending) {
      throw new Error("Tidak dapat membuat kontrak baru, masih ada kontrak dalam proses persetujuan");
    }

    // cek kontrak ditolak
    const rejected = await prismaClient.contracts.findFirst({
      where: {
        id_karyawan: employee_id,
        status_persetujuan: ContractStatus.ditolak,
      },
    });

    if (rejected) {
      throw new Error("Tidak dapat membuat kontrak baru, kontrak sebelumnya ditolak");
    }

    // pastikan kontrak sebelumnya sudah selesai dan sudah disetujui
    const lastContract = await prismaClient.contracts.findFirst({
      where: {
        id_karyawan: employee_id,
        status_persetujuan: ContractStatus.disetujui,
      },
      orderBy: { tgl_selesai: "desc" },
    });

    if (lastContract && lastContract.tgl_selesai && lastContract.tgl_selesai > new Date()) {
      throw new Error("Kontrak sebelumnya masih aktif atau belum selesai");
    }

    //  ambil semua kontrak sebelumnya dari karyawan
    const contracts = await prismaClient.contracts.findMany({
      where: {
        id_karyawan: employee_id,
        status_persetujuan: ContractStatus.disetujui,
      },
      select: {
        masa_kontrak: true,
      },
    });

    // Hitung total lama kontrak sebelum ini
    const totalBulanSebelumnya = contracts.reduce((acc, c) => acc + c.masa_kontrak, 0);

    // check total kontrak
    if (totalBulanSebelumnya >= 60) {
      throw new Error("Total kontrak sebelumnya sudah lebih dari 5 tahun, karyawan harus menjadi permanen");
    }

    if (totalBulanSebelumnya + validatedRequest.masa_kontrak > 60) {
      const sisa = 60 - totalBulanSebelumnya;
      throw new Error(`Masa total kontrak melebihi batas. Anda hanya bisa melakukan kontrak selama ${sisa} bulan`);
    }

    // Hitung tanggal selesai otomatis
    const mulai = new Date(validatedRequest.tgl_mulai);
    const selesai = HitungTanggalSelesai(mulai, validatedRequest.masa_kontrak);

    await prismaClient.contracts.create({
      data: {
        id_karyawan: employee_id,
        tgl_mulai: mulai,
        tgl_selesai: selesai,
        masa_kontrak: validatedRequest.masa_kontrak,
        status_persetujuan: ContractStatus.pending,
      },
    });

    return {
      message: "Kontrak berhasil dibuat",
    };
  }

  static async update(employee_id: string, contract_id: string, request: UpdateContractRequest) {
    // validasi data
    const validated = Validation.validate(ContractValidation.UPDATE, request);

    // ambil kontrak yang mau di update
    const contract = await prismaClient.contracts.findUnique({
      where: {
        id: contract_id,
        id_karyawan: employee_id,
      },
    });

    if (!contract) throw new Error("kontrak tidak ditemukan");

    // tidak boleh update jika kontrak sudah disetujui
    if (contract.status_persetujuan === ContractStatus.disetujui) {
      throw new Error("Kontrak yang sudah disetujui tidak dapat diubah");
    }

    // ambil seluruh kontrak final sebelumnya (kecuali kontrak ini)
    const previouContracts = await prismaClient.contracts.findMany({
      where: {
        id_karyawan: contract.id_karyawan,
        status_persetujuan: ContractStatus.disetujui,
        NOT: { id: contract_id },
      },
      select: { masa_kontrak: true },
    });

    // Hitung total lama kontrak sebelum ini
    const totalBulanSebelumnya = previouContracts.reduce((acc, c) => acc + c.masa_kontrak, 0);

    // jika masa kontrak di update maka hitung ulang
    const masaBaru = validated.masa_kontrak ?? contract.masa_kontrak;
    const totalBaru = totalBulanSebelumnya + masaBaru;

    if (totalBaru > 60) {
      const sisa = 60 - totalBulanSebelumnya;
      throw new Error(`Melebihi batas total kontrak (5 tahun). Sisa yang boleh: ${sisa} bulan`);
    }

    // hitung tanggal selesai
    const mulai = validated.tgl_mulai ? new Date(validated.tgl_mulai) : contract.tgl_mulai;
    const selesai = HitungTanggalSelesai(mulai, masaBaru);

    // lakukan update
    await prismaClient.contracts.update({
      where: { id: contract_id },
      data: {
        tgl_mulai: mulai,
        masa_kontrak: masaBaru,
        tgl_selesai: selesai,
        status_persetujuan: ContractStatus.pending,
      },
    });

    return { message: "Kontrak berhasil diupdate!" };
  }

  static async get(employee_id: string) {
    const contract = await prismaClient.contracts.findFirst({
      where: {
        id_karyawan: employee_id,
      },
    });

    if (!contract) {
      throw new Error("Kontrak tidak ditemukan");
    }

    return contract;
  }
}
