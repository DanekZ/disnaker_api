export type EmployeeResponse = {
  message: string;

  data: {
    NIK: string;
    nama: string;
    kode_divisi: Number;
    kode_jabatan: Number;
    id_perusahaan: Number;
    status: string;
  };
};

export type CreateEmployeeRequest = {
  NIK: string;
  nama: string;
  kode_divisi: Number;
  kode_jabatan: Number;
  id_perusahaan: Number;
  status: string;
};

export type UpdateEmployeeRequest = {
  NIK: string;
  nama: string;
  kode_divisi: Number;
  kode_jabatan: Number;
  id_perusahaan: Number;
  status: string;
};
