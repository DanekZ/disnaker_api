import { type NextFunction, type Request, type Response } from "express";
import AdminService from "../services/admin-service";
import { CreateAdminRequest, LoginAdminRequest } from "../models/admin-model";
import logger from "../app/logging";

export class AdminController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const reqBody: CreateAdminRequest = req.body;
      const result = await AdminService.register(reqBody);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const reqBody: LoginAdminRequest = req.body;
      const result = await AdminService.login(reqBody);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
