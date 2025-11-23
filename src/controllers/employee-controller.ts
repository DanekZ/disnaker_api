import { CreateEmployeeRequest, UpdateEmployeeRequest } from "../models/employe-model";
import { type Request, type Response, type NextFunction } from "express";
import EmployeeService from "../services/employee-service";
import logger from "../app/logging";

export class EmployeeController {
  static async getDetail(req: Request, res: Response, next: NextFunction) {
    const employee_id = req.params.employee_id;
    try {
      const result = await EmployeeService.getDetail(employee_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    const company_id = req.params.company_id;
    try {
      const result = await EmployeeService.get(company_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateEmployeeRequest = req.body;
      const company_id = req.params.company_id;

      logger.error("request employee: %o", request);
      const result = await EmployeeService.create(company_id, request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request: UpdateEmployeeRequest = req.body;
      const employee_id = req.params.employee_id;
      logger.error("request employee: %o", request);
      const result = await EmployeeService.update(employee_id, request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const employee_id = req.params.employee_id;
      const result = await EmployeeService.delete(employee_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
