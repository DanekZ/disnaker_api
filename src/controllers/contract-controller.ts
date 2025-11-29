import { type NextFunction, type Request, type Response } from "express";
import { CreateContractRequest, UpdateContractRequest } from "../models/contract-model";
import ContractService from "../services/contract-service";

export class ContractController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateContractRequest = req.body;
      const id_karyawan: string = req.params.employee_id;

      const result = await ContractService.create(id_karyawan, request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id_karyawan: string = req.params.id_karyawan;

      const result = await ContractService.get(id_karyawan);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, contract_id } = req.params;
      console.log({ employee_id, contract_id });
      const request: UpdateContractRequest = req.body;
      const result = await ContractService.update(employee_id, contract_id, request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
