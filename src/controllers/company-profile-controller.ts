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

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const status = String(req.query.status || '') as any;
      const search = String(req.query.search || '');
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const result = await CompanyProfileService.list({ status: status || undefined, search: search || undefined, page, limit });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = String(req.query.user_id || "");
      const id = String(req.query.id || "");
      const result = id ? await CompanyProfileService.getById(id) : await CompanyProfileService.getByUserId(user_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CompanyProfileService.create(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CompanyProfileService.update({ ...req.body, id: String(req.params.id) });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const result = await CompanyProfileService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const disnaker_id = String(req.body.disnaker_id);
      const result = await CompanyProfileService.approve({ id, disnaker_id });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const disnaker_id = String(req.body.disnaker_id || "");
      const result = await CompanyProfileService.reject({ id, disnaker_id });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
