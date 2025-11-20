import { type NextFunction, type Request, type Response } from "express";
import { CreateContractRequest } from "../models/contract-model";
import ContractService from "../services/contract-service";

export class ContractController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateContractRequest = req.body;

      const result = await ContractService.create(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
