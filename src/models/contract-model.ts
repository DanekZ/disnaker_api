import { ContractStatus } from "../generated/prisma/enums";

export type ContractData = {
  id_karyawan: string;
  tgl_mulai: Date;
  masa_kontrak: number;
  kontrak_file?: string;
  status_kontrak?: ContractStatus;
};
