import { Request } from "express";

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
}

export interface UserRequest extends Request {
  user?: AuthUser;
}
