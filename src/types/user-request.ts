import { Request } from "express";
import { AdminData } from "../models/admin-model";

export interface UserRequest extends Request {
  user?: AdminData;
}
