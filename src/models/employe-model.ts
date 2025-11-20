import { ContractStatus, EmployeeStatus } from "../generated/prisma/enums";

export type EmployeeResponse = {
  message: string;
};

export type CreateEmployeeRequest = {
  NIK: string;
  nama: string;
  kode_divisi: number;
  kode_jabatan: number;
  id_perusahaan: string;
  status_persetujuan?: ContractStatus;
  tgl_mulai: Date;
  masa_kontrak: number;
  kontrak_file?: string;
  status_kontrak?: EmployeeStatus;
  tgl_selesai: Date;
};

export type EmployeeData = {
  NIK: string;
  kode_jabatan: number;
  kode_divisi: number;
  id_perusahaan: string;
  nama: string;
};

export type UpdateEmployeeRequest = {
  NIK: string;
  nama: string;
  kode_divisi: number;
  kode_jabatan: number;
  id_perusahaan: string;
};
