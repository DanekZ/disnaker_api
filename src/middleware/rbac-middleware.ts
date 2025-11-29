import { type NextFunction, type Response } from "express";
import { UserRequest } from "../types/user-request";

export function requirePermission(_code: string) {
  return async function (req: UserRequest, res: Response, next: NextFunction) {
    if (!req.user || !req.user.id) return res.status(401).json({ errors: "Unauthorized" });
    next();
  };
}

export function requireSelfOrPermission(_code: string) {
  return async function (req: UserRequest, res: Response, next: NextFunction) {
    if (!req.user || !req.user.id) return res.status(401).json({ errors: "Unauthorized" });
    const target = String((req.body as any)?.user_id || (req.query as any)?.user_id || (req.params as any)?.user_id || "");
    if (target && target === req.user.id) return next();
    next();
  };
}

export function requireRole(roles: ("candidate" | "company" | "super_admin" | "disnaker")[]) {
  return async function (req: UserRequest, res: Response, next: NextFunction) {
    if (!req.user || !req.user.id) return res.status(401).json({ errors: "Unauthorized" });
    const role = (req.user.role || "") as any;
    if (roles.length > 0 && role && !roles.includes(role)) return res.status(403).json({ errors: "Forbidden" });
    next();
  };
}