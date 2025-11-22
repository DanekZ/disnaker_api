import { AdminDivisions, UserRole } from "../generated/prisma/enums";

export type UserData = {
  username: string;
  password: string;
  role: UserRole;
  email: string;
};

export type CreateDisnakerRequest = {
  user: UserData;
  confirm_password: string;
  divisi: AdminDivisions;
  full_name: string;
};

// export type UpdateAdminRequest = {
//   username: string;
//   password: string;
//   role_code: string;
//   id_perusahaan: number;
// };

export type LoginDisnakerRequest = {
  username: string;
  password: string;
};
