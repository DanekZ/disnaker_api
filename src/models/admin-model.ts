export type AdminResponse = {
  message: string;
};

export type AdminData = {
  username: string;
  password: string;
  role: "perusahaan" | "disnaker";
  id_perusahaan: number;
  token?: string | null;
};

export type CreateAdminRequest = {
  username: string;
  password: string;
  role_code: string;
  id_perusahaan: number;
};

export type UpdateAdminRequest = {
  username: string;
  password: string;
  role_code: string;
  id_perusahaan: number;
};
