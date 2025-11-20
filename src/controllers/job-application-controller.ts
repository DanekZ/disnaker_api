import { type NextFunction, type Request, type Response } from "express";
import JobApplicationService from "../services/job-application-service";

export class JobApplicationController {
  static async apply(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobApplicationService.apply(req.body); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async list(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobApplicationService.list(req.query as any); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobApplicationService.update({ ...req.body, id: String(req.params.id) }); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobApplicationService.delete(String(req.params.id)); res.status(200).json(result); } catch (e) { next(e); }
  }
}