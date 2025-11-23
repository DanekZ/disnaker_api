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
