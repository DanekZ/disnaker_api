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
    try {
      const uid = (req.header("X-User-Id") || "").toString();
      let body = { ...req.body, id: String(req.params.id) } as any;
      if (uid) {
        const { prismaClient } = await import("../app/database");
        const user = await prismaClient.users.findUnique({ where: { id: uid }, include: { role_ref: true } });
        if (user?.role_ref?.name === "company") {
          body.status = "pending";
        }
      }
      const result = await JobsService.update(body);
      res.status(200).json(result);
    } catch (e) { next(e); }
  }
  static async approve(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobsService.approve({ id: String(req.params.id), disnaker_id: String(req.body.disnaker_id) }); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async close(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobsService.close({ id: String(req.params.id) }); res.status(200).json(result); } catch (e) { next(e); }
  }
  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const disnaker_id = String(req.body.disnaker_id || "");
      const result = await JobsService.reject({ id: String(req.params.id), disnaker_id } as any);
      res.status(200).json(result);
    } catch (e) { next(e); }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    try { const result = await JobsService.delete(String(req.params.id)); res.status(200).json(result); } catch (e) { next(e); }
  }
}