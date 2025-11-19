import { type NextFunction, type Request, type Response } from "express";
import UserService from "../services/user-service";
import { LoginUserRequest, RegisterUserRequest } from "../models/user-model";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as RegisterUserRequest;
      const result = await UserService.register(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as LoginUserRequest;
      const result = await UserService.login(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = String(req.query.user_id || "");
      const result = await UserService.getById(user_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}