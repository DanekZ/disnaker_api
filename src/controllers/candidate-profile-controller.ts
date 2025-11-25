import { type NextFunction, type Request, type Response } from "express";
import CandidateProfileService from "../services/candidate-profile-service";

export class CandidateProfileController {
  static async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CandidateProfileService.upsert(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = String(req.query.user_id || "");
      const id = String(req.query.id || "");
      const result = id ? await CandidateProfileService.getById(id) : await CandidateProfileService.getByUserId(user_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CandidateProfileService.list(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CandidateProfileService.create(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CandidateProfileService.update({ ...req.body, id: String(req.params.id) });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const result = await CandidateProfileService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}