import { type NextFunction, type Request, type Response } from "express";
import JobsService from "../services/jobs-service";

export class JobsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobsService.create(req.body); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async list(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobsService.list(req.query as any); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async get(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobsService.get(String(req.params.id)); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobsService.update({ ...req.body, id: String(req.params.id) }); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async approve(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobsService.approve({ id: String(req.params.id), disnaker_id: String(req.body.disnaker_id) }); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async close(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobsService.close({ id: String(req.params.id) }); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobsService.delete(String(req.params.id)); res.status(200).json(result); } catch (e) { next(e); }
  }
}