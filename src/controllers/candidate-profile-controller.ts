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
      const result = await CandidateProfileService.getByUserId(user_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}