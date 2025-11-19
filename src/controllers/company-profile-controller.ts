import { type NextFunction, type Request, type Response } from "express";
import CompanyProfileService from "../services/company-profile-service";

export class CompanyProfileController {
  static async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CompanyProfileService.upsert(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}