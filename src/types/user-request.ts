import { Request } from "express";
import { AdminData } from "../models/disnaker-model";

export interface UserRequest extends Request {
  user?: AdminData;
}
