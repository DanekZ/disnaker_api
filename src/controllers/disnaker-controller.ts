import { type NextFunction, type Request, type Response } from "express";
import { CreateDisnakerRequest, LoginDisnakerRequest } from "../models/disnaker-model";
import logger from "../app/logging";
import DisnakerService from "../services/disnaker-service";

export class DisnakerController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const reqBody: CreateDisnakerRequest = req.body;
      const result = await DisnakerService.register(reqBody);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const reqBody: LoginDisnakerRequest = req.body;
      const result = await DisnakerService.login(reqBody);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
