import { Request } from "express";

export interface UserRequest extends Request {
  user?: { id: string; disnaker_id: string };
  company_user?: { id: string; company_id: string };
}
