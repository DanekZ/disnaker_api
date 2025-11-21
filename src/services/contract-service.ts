import { prismaClient } from "../app/database";
import HitungTanggalSelesai from "../helper/contract/hitung-tanggal-selesai";
import { CreateContractRequest } from "../models/contract-model";

export default class ContractService {
  static async create(id_karyawan: string, request: CreateContractRequest) {
    const { tgl_mulai, masa_kontrak, kontrak_file, status_kontrak, status_persetujuan } = request;

    const mulai: Date = new Date(tgl_mulai);
    const selesai: Date = HitungTanggalSelesai(mulai, masa_kontrak);

    //  ambil kontrak terakhir karyawan
    const lastContract = await prismaClient.contracts.findFirst({
      where: {
        id_karyawan,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    //  validasi
    // 1. kalau punya kontrak lama tapi belum habis, tidak bisa buat baru
    if (lastContract && lastContract.tgl_selesai && lastContract.tgl_selesai > new Date()) {
      throw new Error("Karyawan masih memiliki kontrak yang aktif");
    }

    //  2. Validasi urutan PKWT
    if (status_kontrak == "PKWT_2") {
      if (!lastContract || lastContract.status_kontrak == "PKWT_1") {
        if (lastContract && (lastContract.status_persetujuan == "ditolak" || lastContract.status_persetujuan == "pending")) {
          throw new Error("PKWT 2 hanya bisa dibuat jika sudah ada PKWT 1 yang sudah diverifikasi dan telah disetujui");
        }
      }
    }

    if (status_kontrak == "PKWT_1") {
      if (lastContract && lastContract.status_kontrak == "PKWT_2") {
        throw new Error("Tidak dapat kembali ke PKWT 1 setelah PKWT 2");
      }
    }

    // 3. Validasi jika status sudah ada pkwt 1, tidak bisa buat lagi
    if (status_kontrak == "PKWT_1") {
      if (lastContract && lastContract.status_kontrak == "PKWT_1") {
        throw new Error("Anda sudah memiliki PKWT 1, tidak dapat membuat PKWT 1 lagi");
      }
    }

    //  Jika sudah pernah pkwt 1 & pkwt 2 maka wajib permanen
    const pernah1 = await prismaClient.contracts.findFirst({
      where: {
        id_karyawan,
        status_kontrak: "PKWT_1",
      },
    });

    const pernah2 = await prismaClient.contracts.findFirst({
      where: {
        id_karyawan,
        status_kontrak: "PKWT_2",
      },
    });

    if (pernah1 && pernah2) {
      if (status_kontrak != "permanent") {
        throw new Error("Karyawan sudah pernah memiliki PKWT 1 dan PKWT 2, maka harus permanen");
      }
    }

    // jika status kontrak permanent
    if (status_kontrak == "permanent") {
      // jika sudah pernah memiliki kontrak permanen
      if (lastContract && lastContract.status_kontrak == "permanent") {
        throw new Error("Anda sudah memiliki kontrak permanen");
      }

      // jika belum melewati verifikasi PKWT 2
      if (lastContract && (lastContract.status_persetujuan == "pending" || lastContract.status_persetujuan == "ditolak")) {
        throw new Error("Tidak bisa menambahkan status permanen, karena belum melewati verifikasi PKWT 2");
      }

      // jika kontrak sebelumnya sudah disetujui dan belum habis
      if (lastContract && lastContract.status_persetujuan == "disetujui" && lastContract.tgl_selesai && lastContract.tgl_selesai > new Date()) {
        throw new Error("Tidak bisa menambahkan status permanen, karena kontrak PKWT 2 masih aktif");
      }
    }

    //  Simpan Data
    await prismaClient.contracts.create({
      data: {
        id_karyawan,
        tgl_mulai: mulai,
        masa_kontrak,
        tgl_selesai: selesai,
        status_kontrak,
      },
    });

    return {
      message: "Kontrak berhasil dibuat",
    };
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
