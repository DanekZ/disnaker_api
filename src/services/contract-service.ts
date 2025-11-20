import { prismaClient } from "../app/database";
import HitungTanggalSelesai from "../helper/contract/hitung-tanggal-selesai";
import { CreateContractRequest } from "../models/contract-model";

export default class ContractService {
  static async create(request: CreateContractRequest) {
    const { id_karyawan, tgl_mulai, masa_kontrak, kontrak_file, status_kontrak, status_persetujuan } = request;

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
    if (lastContract && lastContract.tgl_selesai > new Date()) {
      throw new Error("Karyawan masih memiliki kontrak yang aktif");
    }

    //  2. Validasi urutan PKWT
    if (status_kontrak == "PKWT_2") {
      if (!lastContract || lastContract.status_kontrak != "PKWT_1") {
        throw new Error("PKWT 2 hanya bisa dibuat jika sudah ada PKWT 1 yang sudah diverifikasi");
      }
    }

    if (status_kontrak == "PKWT_1") {
      if (lastContract && lastContract.status_kontrak == "PKWT_2") {
        throw new Error("Tidak dapat kembali ke PKWT 1 setelah PKWT 2");
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

    //  Simpan Data
    const newContract = await prismaClient.contracts.create({
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
}
