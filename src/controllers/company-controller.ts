import { type NextFunction, type Request, type Response } from "express";
import { CreateDivisionRequest, CreatePositionRequest, LoginCompanyRequest, RegisterCompanyRequest, UpdateDivisionRequest, UpdatePositionRequest } from "../models/company-model";
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

  static async getPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId: string = req.params.company_id;
      const result = await CompanyService.getPosition(companyId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async createPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId: string = req.params.company_id;
      const request = req.body as CreatePositionRequest;
      const result = await CompanyService.createPosition(companyId, request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updatePosition(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId: string = req.params.company_id;
      const positionId: number = Number(req.params.position_id);
      const request = req.body as UpdatePositionRequest;
      const result = await CompanyService.updatePosition(companyId, positionId, request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deletePosition(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId: string = req.params.company_id;
      const positionId: number = Number(req.params.position_id);
      const result = await CompanyService.deletePosition(companyId, positionId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async createDivision(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId: string = req.params.company_id;
      const request = req.body as CreateDivisionRequest;
      const result = await CompanyService.createDivision(companyId, request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateDivision(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId: string = req.params.company_id;
      const divisionId: number = Number(req.params.division_id);
      const request = req.body as UpdateDivisionRequest;
      const result = await CompanyService.updateDivision(companyId, divisionId, request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getDivision(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId: string = req.params.company_id;
      const result = await CompanyService.getDivision(companyId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteDivision(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId: string = req.params.company_id;
      const divisionId: number = Number(req.params.division_id);
      const result = await CompanyService.deleteDivision(companyId, divisionId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
