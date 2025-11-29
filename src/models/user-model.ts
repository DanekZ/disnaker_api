export type UserRoleInput = "candidate" | "company" | "super_admin" | "disnaker";

export interface RegisterUserRequest {
  email: string;
  password: string;
  role: UserRoleInput;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface UserAuthResponse {
  message: string;
  id?: string;
  role?: UserRoleInput;
  token?: string;
}