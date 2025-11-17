import { type NextFunction, type Request, type Response } from "express";
import { LoginCompanyRequest } from "../models/company-model";
import CompanyService from "../services/company-service";

export class CompanyController {
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
