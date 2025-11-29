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
      const uid = String((req as any).user?.id || "");
      let body = { ...req.body, id: String(req.params.id) } as any;
      if (uid) {
        const { query } = await import("../app/database");
        const rows = await query<any>("SELECT r.name as role_name FROM users u LEFT JOIN app_roles r ON u.role_ref_id = r.id WHERE u.id = ?", [uid]);
        const role = rows[0]?.role_name;
        if (role === "company") body.status = "pending";
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