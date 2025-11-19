import { type NextFunction, type Request, type Response } from "express";
import DisnakerProfileService from "../services/disnaker-profile-service";

export class DisnakerProfileController {
  static async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DisnakerProfileService.upsert(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = String(req.query.user_id || "");
      const result = await DisnakerProfileService.getByUserId(user_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}