import { ContractStatus, EmployeeStatus } from "../generated/prisma/enums";

export type CreateContractRequest = {
  tgl_mulai: Date;
  tgl_selesai?: Date;
  masa_kontrak: number;
  kontrak_file?: string;
};

export type ContractData = {
  id_karyawan: string;
  tgl_mulai: Date;
  tgl_selesai: Date;
  masa_kontrak: number;
  kontrak_file?: string;
  status_kontrak?: EmployeeStatus;
  status_persetujuan?: ContractStatus;
};
