import { type NextFunction, type Request, type Response } from "express";
import RbacService from "../services/rbac-service";

export class RbacController {
  static async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RbacService.createRole(req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  static async listRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RbacService.listRoles();
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await RbacService.updateRole({ id, ...req.body });
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  static async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await RbacService.deleteRole(id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  static async createPermission(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RbacService.createPermission(req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  static async listPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RbacService.listPermissions();
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  static async assignRolePermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const role_id = Number(req.params.id);
      const result = await RbacService.assignRolePermissions({ role_id, permissions: req.body.permissions || [] });
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  static async getRolePermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const role_id = Number(req.params.id);
      const result = await RbacService.getRolePermissions(role_id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  static async assignUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RbacService.assignUserRole(req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}