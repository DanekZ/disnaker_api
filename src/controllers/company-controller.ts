import { type NextFunction, type Request, type Response } from "express";
import { LoginCompanyRequest, RegisterCompanyRequest } from "../models/company-model";
import CompanyService from "../services/company-service";

export class CompanyController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as RegisterCompanyRequest;
      const result = await CompanyService.register(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as LoginCompanyRequest;
      const result = await CompanyService.login(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
