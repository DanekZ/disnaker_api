import { CreateEmployeeRequest, UpdateEmployeeRequest } from "../models/employe-model";
import { type Request, type Response, type NextFunction } from "express";
import EmployeeService from "../services/employee-service";
import logger from "../app/logging";

export class EmployeeController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateEmployeeRequest = req.body;
      logger.error("request employee: %o", request);
      const result = await EmployeeService.create(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request: UpdateEmployeeRequest = req.body;
      const result = await EmployeeService.update(request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
