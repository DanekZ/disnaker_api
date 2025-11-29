import { type NextFunction, type Request, type Response } from "express";
import { CreateDisnakerRequest, LoginDisnakerRequest } from "../models/disnaker-model";
import logger from "../app/logging";
import DisnakerService from "../services/disnaker-service";
import { ContractStatus } from "../generated/prisma/enums";
import { UserRequest } from "../types/user-request";

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

  static async getContracts(req: Request, res: Response, next: NextFunction) {
    try {
      const status: ContractStatus = req.params.status as ContractStatus;
      const result = await DisnakerService.getContracts(status);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async approveContract(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const idContract = req.params.id;
      const result = await DisnakerService.approveContract(req.user?.disnaker_id || "", idContract);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async rejectContract(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const idContract = req.params.id;
      const { pesan } = req.body;

      const result = await DisnakerService.rejectContract(req.user?.disnaker_id || "", idContract, pesan);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
