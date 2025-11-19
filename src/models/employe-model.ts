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
  status: EmployeeStatus;
  tgl_mulai: Date;
  masa_kontrak: number;
  kontrak_file?: string;
  status_kontrak?: ContractStatus;
};

export type EmployeeData = {
  NIK: string;
  kode_jabatan: number;
  kode_divisi: number;
  id_perusahaan: string;
  nama: string;
  status: EmployeeStatus;
};

export type UpdateEmployeeRequest = {
  NIK: string;
  nama: string;
  kode_divisi: number;
  kode_jabatan: number;
  id_perusahaan: string;
  status: EmployeeStatus;
};
