export type UserRoleInput = "candidate" | "company" | "disnaker";

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
  user_id?: string;
  role?: UserRoleInput;
}