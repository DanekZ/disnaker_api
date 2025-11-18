import { EmployeeStatus } from "../generated/prisma/enums";

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
};

export type UpdateEmployeeRequest = {
  NIK: string;
  nama: string;
  kode_divisi: number;
  kode_jabatan: number;
  id_perusahaan: string;
  status: EmployeeStatus;
};
